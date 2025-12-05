import { NextRequest } from "next/server";
import { getPlanetaryPairById } from "@/data/planetaryPairs";
import { getZodiacSignById } from "@/data/zodiacSigns";
import { calculatePhaseAndAspect } from "@/lib/phaseCalculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pairId, planet1Sign, planet2Sign, degreeSeparation } = body;

    // Validate degree separation if provided
    if (degreeSeparation !== undefined) {
      if (typeof degreeSeparation !== 'number' || degreeSeparation < 0 || degreeSeparation > 360) {
        return new Response(
          JSON.stringify({ error: "Invalid degree separation (must be 0-360)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const pair = getPlanetaryPairById(pairId);
    const sign1 = getZodiacSignById(planet1Sign);
    const sign2 = getZodiacSignById(planet2Sign);

    if (!pair || !sign1 || !sign2) {
      return new Response("Invalid request parameters", { status: 400 });
    }

    const prompt = buildPrompt(pair, sign1, sign2, degreeSeparation);
    const hasPhaseContext = degreeSeparation !== undefined;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://planetary-pairs.vercel.app",
          "X-Title": "Planetary Pairs",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            {
              role: "system",
              content: `You are an expert evolutionary astrologer deeply versed in Jeffrey Wolf Green's teachings.

${hasPhaseContext ? `**PHASE-SPECIFIC SYNTHESIS MODE**:
When phase context is provided in the user message, it represents the EVOLUTIONARY STAGE of the planetary relationship. This is your primary lens for interpretation.

- The PHASE (not the aspect) contains the evolutionary/psychological knowledge
- Weave phase themes organically through ALL 4 sections
- Adjust tone and developmental focus based on the phase's keyword and description
- Connect phase dynamics to the specific zodiac sign placements
- The phase reveals WHERE the person is in their developmental journey with these planetary energies

` : ''}TONE & STYLE:
- Write with warmth, depth, and insight while remaining grounded and practical
- Your tone is supportive and direct, helping people understand their evolutionary journey
- Write in a flowing, readable style with clear paragraphs
- Address the reader directly as "you"
- Be specific to THIS combination rather than generic

LANGUAGE GUIDELINES (VERY IMPORTANT):
- Use practical, human, psychological language
- NOT spiritual, abstract, or "woo-woo"
- Be specific and concrete, not vague
- Keep sentences direct and clear
- Avoid phrases like "cosmic dance", "divine essence", "sacred journey" - instead use grounded psychological language
- When asking reflection questions, make them practical and answerable, e.g.:
  - "Where in your life do you resist change even when you know it's necessary?"
  - "What happens in your body when you feel unseen or unrecognized?"
  - "How do you typically respond when your beliefs are challenged by reality?"

FORMAT:
- Use ## headings for each section
- Write in flowing paragraphs (not bullet points)
- Each section should be 1 substantial paragraph`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", errorText);
      return new Response("Failed to generate report", { status: 500 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Generate error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

function buildPrompt(
  pair: ReturnType<typeof getPlanetaryPairById>,
  sign1: ReturnType<typeof getZodiacSignById>,
  sign2: ReturnType<typeof getZodiacSignById>,
  degreeSeparation?: number
): string {
  if (!pair || !sign1 || !sign2) return "";

  let phaseContext = '';

  if (degreeSeparation !== undefined) {
    const { phase, aspect } = calculatePhaseAndAspect(degreeSeparation);

    if (phase) {
      phaseContext = `

## PHASE CONTEXT (CRITICAL)

The planetary pair is in the **${phase.name}** (${phase.zodiacSign} zodiacal correlation, ${phase.element} element).

**Phase Keyword**: ${phase.keyword}

**Evolutionary Focus**: ${phase.evolutionaryFocus}

**Phase Description**: ${phase.description}

${aspect ? `**Associated Aspect**: ${aspect.name} (${aspect.degrees}°) - This is the measurement that identifies this phase. Focus on the PHASE meaning, not traditional aspect interpretation.` : ''}

---

**INTEGRATION INSTRUCTIONS**:
The phase represents WHERE the individual is in the evolutionary cycle between these two planets. This is THE PRIMARY context for your synthesis.

Weave this phase dynamic throughout ALL 4 sections:
1. **Evolutionary Intention**: How does the ${phase.name} theme (${phase.evolutionaryFocus}) inform the developmental purpose of this pairing?
2. **Struggles & Dilemmas**: What specific challenges arise from being in the ${phase.name}? Connect to "${phase.keyword}"
3. **Working Together**: When these energies cooperate, how do they express the ${phase.name} potential?
4. **Self-Reflection**: Craft questions that help the person identify where they are in this ${phase.name} journey

The phase reveals the DEVELOPMENTAL STAGE of consciousness for this planetary relationship. Let it inform tone, focus, and depth of all sections.

---
      `;
    }
  }

  return `Generate a synthesis report for someone with ${pair.planet1.name} in ${sign1.name} and ${pair.planet2.name} in ${sign2.name}.

## CONTEXT

### The Planetary Pair: ${pair.planet1.name}/${pair.planet2.name}
**Theme**: ${pair.theme}
**Meaning**: ${pair.meaning}

### ${pair.planet1.name} Archetype
${pair.planet1.archetype}: ${pair.planet1.description}

### ${pair.planet2.name} Archetype
${pair.planet2.archetype}: ${pair.planet2.description}

### ${sign1.name} (${sign1.symbol})
**Archetype**: ${sign1.archetype}
**Keywords**: ${sign1.keywords.join(", ")}
**Essence**: ${sign1.essence}
**Evolutionary Teaching**: ${sign1.evolutionaryTeaching}
**Shadow Patterns**: ${sign1.shadowAspects.slice(0, 3).join("; ")}

### ${sign2.name} (${sign2.symbol})
**Archetype**: ${sign2.archetype}
**Keywords**: ${sign2.keywords.join(", ")}
**Essence**: ${sign2.essence}
**Evolutionary Teaching**: ${sign2.evolutionaryTeaching}
**Shadow Patterns**: ${sign2.shadowAspects.slice(0, 3).join("; ")}

${phaseContext}

---

## GENERATE THESE 4 SECTIONS:

${phaseContext ? `**NOTE**: The phase context above must be integrated throughout your response.\n\n` : ''}

### Section 1: The Evolutionary Intention of This Combination
Write ONE substantial paragraph synthesizing what it means to have ${pair.planet1.name} in ${sign1.name} and ${pair.planet2.name} in ${sign2.name} together. What is the soul working toward? What is the evolutionary direction? Be specific to this exact combination.

### Section 2: Potential Struggles & Dilemmas
Write ONE substantial paragraph about what can go wrong with this combination. What are the tensions, the unintegrated expressions, the shadow patterns that emerge when these archetypes aren't working together well? Reference the specific shadow aspects of both signs.

### Section 3: When These Energies Work Together
Write ONE substantial paragraph describing what successful integration looks like. What does it look like when someone has mastered this combination? How do these energies support each other?

### Section 4: Questions for Self-Reflection
Provide 4-5 specific, grounded, psychological questions that help the reader connect to these patterns within themselves. Make them practical and answerable. They should be specific to ${sign1.name} and ${sign2.name} archetypes and the ${pair.planet1.name}/${pair.planet2.name} dynamic.

---

Format your response with ## headings for each section exactly as shown above.`;
}
