import { ZodiacSign } from "@/types";

export const zodiacSigns: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    symbol: "\u2648",
    keywords: ["Initiation", "instinct", "courage", "independence", "action", "will"],
    archetype: "The Archetype of Initiation",
    essence: "Aries represents the spark of new beginnings: the impulse to act, to separate, and to claim individuality. It is the raw instinct to engage life directly and to meet challenge with courage.",
    evolutionaryTeaching: "Aries is the birth of the self in motion. It teaches that courage is not absence of fear, but the decision to move anyway. Every beginning requires a spark, and that spark lives within the soul's will to exist.",
    shadowAspects: [
      "The Impulsive Fighter: Acts without reflection, creating unnecessary conflict",
      "The Isolated Warrior: Lone-wolf independence that rejects support or counsel",
      "The Perpetual Rebel: Opposes authority for identity's sake rather than authenticity",
      "The Fearful Avoider: Suppressed will leading to frustration or passivity",
      "The Burnout Complex: Overexertion and depletion from proving worth through struggle",
      "The Domination Reflex: Mistaking control for strength, confusing assertion with aggression"
    ]
  },
  {
    id: "taurus",
    name: "Taurus",
    symbol: "\u2649",
    keywords: ["Stability", "security", "resources", "self-worth", "embodiment", "sustenance"],
    archetype: "The Archetype of Embodied Value",
    essence: "Taurus represents the instinct to preserve life through continuity and value. It is the archetype of self-preservation and stability, learning to build, sustain, and protect what matters.",
    evolutionaryTeaching: "Taurus is the archetype of embodied value. It teaches that peace is not found through possession but through presence. When we slow down and align with the body and earth, we discover a quiet abundance that does not depend on circumstance.",
    shadowAspects: [
      "The Security Trap: Over-identifying safety with material stability; fear of risk",
      "The Hoarder's Shadow: Accumulation to avoid emptiness or grief",
      "The Pleasure Fixation: Sensual comfort used to numb emotion",
      "The Rigid Preserver: Resistance to change that prevents growth",
      "The Martyr Provider: Over-giving to feel needed or secure",
      "The Body Disconnection: Neglecting physical presence while seeking value externally"
    ]
  },
  {
    id: "gemini",
    name: "Gemini",
    symbol: "\u264A",
    keywords: ["Curiosity", "dialogue", "multiplicity", "paradox", "perception", "communication"],
    archetype: "The Archetype of Connection Through Curiosity",
    essence: "Gemini is the archetype of connection through curiosity. It seeks to understand life by asking questions, exchanging ideas, and exploring the endless diversity of experience.",
    evolutionaryTeaching: "Gemini is the art of thinking in connection. It teaches that understanding emerges through dialogue and curiosity. When Gemini listens as deeply as it speaks, the world becomes a mirror of mind in motion.",
    shadowAspects: [
      "The Scattered Mind: Overstimulation, fragmentation, loss of depth",
      "The Gossip Complex: Words used to deflect intimacy or inflate self-importance",
      "The Trickster's Shadow: Manipulation disguised as cleverness",
      "The Information Hoarder: Consuming knowledge without integration",
      "The Mirror Maze: Endless analysis without conclusion",
      "The Flight Reflex: Using distraction to avoid emotional truth"
    ]
  },
  {
    id: "cancer",
    name: "Cancer",
    symbol: "\u264B",
    keywords: ["Safety", "nurture", "protection", "belonging", "memory", "intimacy"],
    archetype: "The Archetype of Emotional Safety",
    essence: "Cancer represents the inner world of emotion and attachment: the sacred terrain of feeling, memory, and belonging. It is where the soul learns to protect what is vulnerable.",
    evolutionaryTeaching: "Cancer teaches the alchemy of emotional safety: the transformation of vulnerability into strength. Through empathy and reflection, it reconnects us with the wisdom of feeling and the sacredness of belonging.",
    shadowAspects: [
      "The Overprotector: Controls or shelters others to avoid personal insecurity",
      "The Emotional Reactor: Defines truth by mood; uses emotion as defense",
      "The Abandoned Child: Seeks validation through dependency or overgiving",
      "The Parentified One: Becomes caretaker to compensate for lack of care received",
      "The Shell Complex: Emotional withdrawal or passive resentment",
      "The Nostalgic Loop: Clinging to the past, unable to trust new experiences"
    ]
  },
  {
    id: "leo",
    name: "Leo",
    symbol: "\u264C",
    keywords: ["Identity", "creativity", "self-expression", "visibility", "purpose", "authenticity"],
    archetype: "The Archetype of Creative Radiance",
    essence: "Leo is the solar principle of individuation: the moment the soul recognizes itself as a creative force. It is where the self seeks to express its inner light and become visible in the world.",
    evolutionaryTeaching: "Leo teaches that visibility is sacred when it serves the whole. It is the archetype of the radiant heart: courageous, creative, and generous. When Leo's light is guided by love rather than ego, it becomes a sun for others to grow by.",
    shadowAspects: [
      "The Performer's Mask: Charisma used to hide insecurity",
      "The Spotlight Complex: Craving attention as proof of worth",
      "The Golden Child Wound: Building identity on praise; collapse when unrecognized",
      "The Tyrant King/Queen: Control and arrogance replacing generosity",
      "The Invisible Lion: Suppressed creative fire due to fear of rejection",
      "The Comparison Trap: Measuring worth by others' light instead of one's own"
    ]
  },
  {
    id: "virgo",
    name: "Virgo",
    symbol: "\u264D",
    keywords: ["Refinement", "service", "discernment", "order", "humility", "wholeness"],
    archetype: "The Archetype of Sacred Refinement",
    essence: "Virgo is the archetype of refinement through experience. It represents the sacred movement from innocence into mastery, where the soul learns to integrate imperfection through humility and service.",
    evolutionaryTeaching: "Virgo teaches that grace is found in the details. It is the archetype of integration, service, and healing: the one who restores coherence to the fragmented. When Virgo moves beyond perfectionism into presence, it becomes the sacred artisan of life.",
    shadowAspects: [
      "The Perfectionist: Seeks control through flawlessness; never feels good enough",
      "The Martyr Helper: Overextends service to prove value; neglects self",
      "The Inner Critic: Rigid self-judgment disguised as moral duty",
      "The Frozen Servant: Numbness or exhaustion from over-functioning",
      "The Chaos Aversion: Anxiety about disorder; intolerance for spontaneity",
      "The Failed Healer: Despair or guilt when efforts don't produce healing"
    ]
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "\u264E",
    keywords: ["Relationship", "reflection", "justice", "harmony", "balance", "reciprocity"],
    archetype: "The Archetype of Relational Consciousness",
    essence: "Libra represents the field of relationship, where self meets other, and awareness evolves through reflection. It is the archetype of dynamic balance, where tension becomes the catalyst for harmony.",
    evolutionaryTeaching: "Libra teaches that relationship is the path to wholeness. It is through connection, reflection, and tension that consciousness matures. When Libra learns to hold difference without losing love, it becomes the bridge through which peace and sacred partnership are born.",
    shadowAspects: [
      "The Pleaser: Seeks peace through self-erasure",
      "The Indecisive One: Avoids action for fear of imbalance",
      "The Mirror Trap: Over-identifies with others' perceptions",
      "The False Neutral: Uses fairness to avoid emotional truth",
      "The Scapegoat: Becomes the vessel of collective tension",
      "The Romantic Idealist: Projects perfection onto others to avoid self-integration"
    ]
  },
  {
    id: "scorpio",
    name: "Scorpio",
    symbol: "\u264F",
    keywords: ["Transformation", "death and rebirth", "intimacy", "power", "trust", "regeneration"],
    archetype: "The Archetype of Evolution Through Surrender",
    essence: "Scorpio is the archetype of evolution through surrender. It governs the instinct to merge deeply with life and others, emotionally, psychologically, spiritually, and through that merging, to be changed.",
    evolutionaryTeaching: "Scorpio teaches that power is born of surrender. It is the archetype of rebirth: the willingness to descend, to face what is hidden, and to emerge renewed. When Scorpio transforms fear into trust, it becomes the guardian of emotional truth.",
    shadowAspects: [
      "The Controller: Manipulates to avoid exposure",
      "The Betrayer: Destroys trust to maintain dominance",
      "The Obsessive: Fixates on emotional or sexual control",
      "The Secret Keeper: Holds pain in silence, fearing judgment",
      "The Avenger: Equates justice with revenge",
      "The Intensity Addict: Confuses chaos with connection"
    ]
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    symbol: "\u2650",
    keywords: ["Expansion", "truth", "exploration", "freedom", "belief", "wisdom"],
    archetype: "The Archetype of the Quest for Meaning",
    essence: "Sagittarius represents the quest for meaning and coherence: the soul's urge to understand life's larger purpose. It is the archetype of discovery, synthesis, and vision.",
    evolutionaryTeaching: "Sagittarius teaches the freedom of faith and vision: the courage to expand beyond certainty into wisdom. It invites the soul to live as a pilgrim of truth, guided by curiosity and trust.",
    shadowAspects: [
      "The Zealot: Clings to belief as absolute truth; resists complexity",
      "The Wanderer Without Map: Seeks novelty without meaning",
      "The Preacher Complex: Converts others to feel secure in one's worldview",
      "The Escapist Adventurer: Avoids inner truth by chasing external experience",
      "The False Prophet: Uses charisma or optimism to deny reality",
      "The Cynic: Turns disillusionment into nihilism rather than insight"
    ]
  },
  {
    id: "capricorn",
    name: "Capricorn",
    symbol: "\u2651",
    keywords: ["Responsibility", "mastery", "discipline", "structure", "integrity", "authority"],
    archetype: "The Archetype of Mastery Through Time",
    essence: "Capricorn represents the principle of maturity and manifestation: the soul's movement from vision into structure. It is the archetype of endurance, integrity, and wisdom earned through limitation.",
    evolutionaryTeaching: "Capricorn is the archetype of mastery through time. It teaches that responsibility is sacred: the bridge between vision and manifestation. Through patience, purpose, and inner authority, Capricorn becomes the elder and builder.",
    shadowAspects: [
      "The Overachiever: Seeks worth through performance and status",
      "The Controller: Uses power to avoid vulnerability",
      "The Cynic: Protects from disappointment through pessimism",
      "The Martyr of Duty: Sacrifices joy to maintain order",
      "The Cold Mountain: Withdraws emotionally in pursuit of perfection",
      "The Fallen Authority: Becomes rigid or corrupt when power is misused"
    ]
  },
  {
    id: "aquarius",
    name: "Aquarius",
    symbol: "\u2652",
    keywords: ["Innovation", "liberation", "individuality", "reform", "vision", "community"],
    archetype: "The Archetype of Liberation Through Awareness",
    essence: "Aquarius represents the principle of liberation through awareness: the impulse to break from outdated systems and awaken collective intelligence. It is the archetype of truth that disrupts conformity.",
    evolutionaryTeaching: "Aquarius teaches that true revolution is consciousness expanded. It awakens the visionary within, the part of the soul that remembers its connection to the whole. When individuality merges with empathy, Aquarius becomes the architect of the future.",
    shadowAspects: [
      "The Detached Observer: Withdraws emotionally to maintain superiority",
      "The Rebel Without Vision: Destroys systems without offering renewal",
      "The Idealist's Disillusionment: Becomes cynical when utopias fail",
      "The Outsider Wound: Identifies with isolation as identity",
      "The Cold Rationalist: Prioritizes intellect over compassion",
      "The Fragmented Visionary: Overwhelmed by ideas, unable to ground them"
    ]
  },
  {
    id: "pisces",
    name: "Pisces",
    symbol: "\u2653",
    keywords: ["Unity", "surrender", "compassion", "dissolution", "imagination", "transcendence"],
    archetype: "The Archetype of Transcendence and Unity",
    essence: "Pisces represents the principle of transcendence and unity: the soul's longing to merge with the divine and dissolve separation. It is the archetype of compassion, creativity, and spiritual surrender.",
    evolutionaryTeaching: "Pisces teaches the grace of surrender: the end and the beginning of the evolutionary cycle. It reveals that healing comes through unity, not escape, and that love is the bridge between all opposites.",
    shadowAspects: [
      "The Escapist: Uses fantasy or substance to avoid pain",
      "The Martyr Complex: Confuses suffering with virtue",
      "The Savior: Overextends compassion to rescue others",
      "The Dream Addict: Lives in imagination without embodiment",
      "The Lost Self: Dissolves identity in others' emotions",
      "The Victim: Identifies with helplessness to avoid responsibility"
    ]
  }
];

export function getZodiacSignById(id: string): ZodiacSign | undefined {
  return zodiacSigns.find(sign => sign.id === id);
}
