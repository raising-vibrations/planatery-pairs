"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanetaryPair } from "@/types";
import { zodiacSigns, getZodiacSignById } from "@/data/zodiacSigns";
import { calculatePhaseAndAspect } from "@/lib/phaseCalculator";
import { useGenerationTokens } from '@/hooks/useGenerationTokens';
import { TokenLimitModal } from '@/components/TokenLimitModal';
import { Sparkles, FileDown, Loader2, Info } from "lucide-react";

interface PairExplorerProps {
  pair: PlanetaryPair;
}

export function PairExplorer({ pair }: PairExplorerProps) {
  const [planet1Sign, setPlanet1Sign] = useState<string>("");
  const [planet2Sign, setPlanet2Sign] = useState<string>("");
  const [degreeSeparation, setDegreeSeparation] = useState<string>("");
  const [phaseResult, setPhaseResult] = useState<ReturnType<typeof calculatePhaseAndAspect> | null>(null);
  const [report, setReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    remaining,
    canGenerate,
    isUnlocked,
    maxGenerations,
    incrementCount,
    unlockWithPassword,
  } = useGenerationTokens(pair.id);

  const [showTokenModal, setShowTokenModal] = useState(false);

  const sign1 = getZodiacSignById(planet1Sign);
  const sign2 = getZodiacSignById(planet2Sign);
  const bothSignsSelected = sign1 && sign2;

  // Calculate phase when degree changes
  useEffect(() => {
    const num = parseFloat(degreeSeparation);
    if (degreeSeparation && !isNaN(num) && num >= 0 && num <= 360) {
      const result = calculatePhaseAndAspect(num);
      setPhaseResult(result);
    } else {
      setPhaseResult(null);
    }
  }, [degreeSeparation]);

  const handleGenerate = async () => {
    if (!bothSignsSelected) return;

    // Check token limit
    if (!canGenerate) {
      setShowTokenModal(true);
      return;
    }

    setIsGenerating(true);
    setError("");
    setReport("");

    try {
      const degreeNum = parseFloat(degreeSeparation);
      const body: any = {
        pairId: pair.id,
        planet1Sign,
        planet2Sign,
      };

      // Only include degree if valid
      if (degreeSeparation && !isNaN(degreeNum) && degreeNum >= 0 && degreeNum <= 360) {
        body.degreeSeparation = degreeNum;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        setReport((prev) => prev + chunk);
      }

      // Increment count after successful generation
      incrementCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{pair.planet1.symbol}</span>
          <span className="text-4xl">{pair.planet2.symbol}</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-foreground">
          {pair.planet1.name}/{pair.planet2.name}
        </h1>
        <p className="mt-1 text-lg text-primary font-medium">{pair.theme}</p>
        {pair.cycle && (
          <p className="mt-1 text-sm text-muted-foreground">{pair.cycle}</p>
        )}
      </div>

      {/* About This Pair */}
      <Card>
        <CardHeader>
          <CardTitle>About This Pair</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{pair.meaning}</p>
        </CardContent>
      </Card>

      {/* Sign Selectors */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Placements</CardTitle>
          <CardDescription>
            Choose the zodiac sign for each planet to see your archetypal profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {pair.planet1.symbol} {pair.planet1.name} in
              </label>
              <Select value={planet1Sign} onValueChange={setPlanet1Sign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sign..." />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map((sign) => (
                    <SelectItem key={sign.id} value={sign.id}>
                      {sign.symbol} {sign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {pair.planet2.symbol} {pair.planet2.name} in
              </label>
              <Select value={planet2Sign} onValueChange={setPlanet2Sign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sign..." />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map((sign) => (
                    <SelectItem key={sign.id} value={sign.id}>
                      {sign.symbol} {sign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional: Degree Separation Input */}
      {bothSignsSelected && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Optional: Add Evolutionary Phase Context
            </CardTitle>
            <CardDescription>
              Enter the degree separation between your planets to receive a phase-specific synthesis.
              <a href="/understanding-phases-aspects" className="ml-1 text-primary hover:underline">
                Learn more
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Degree Separation (0-360°)
              </label>
              <Input
                type="number"
                min="0"
                max="360"
                placeholder="e.g., 150"
                value={degreeSeparation}
                onChange={(e) => setDegreeSeparation(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                The angular distance between your two planets
              </p>
            </div>

            {phaseResult && phaseResult.phase && (
              <div className="p-4 border rounded-lg bg-primary/5 border-primary/30">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-primary">
                      {phaseResult.phase.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {phaseResult.phase.zodiacSign} · {phaseResult.phase.element} Element
                    </p>
                  </div>
                  <Badge variant={phaseResult.phase.element === 'Yang' ? 'default' : 'secondary'}>
                    {phaseResult.phase.element}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {phaseResult.phase.keyword}
                </p>
                <p className="text-sm leading-relaxed">
                  {phaseResult.phase.description}
                </p>

                {phaseResult.aspect && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Aspect:</span> {phaseResult.aspect.name} ({phaseResult.aspect.degrees}°)
                      {phaseResult.degreeFromAspect !== null && (
                        <span className="ml-1">
                          · {phaseResult.degreeFromAspect.toFixed(1)}° from exact
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {phaseResult.message && (
                  <p className="text-xs text-muted-foreground italic mt-2">
                    {phaseResult.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STATIC SECTIONS - Show when both signs are selected */}
      {bothSignsSelected && (
        <>
          {/* Section 1: Your Planetary Pair */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                You have chosen the {pair.planet1.name}/{pair.planet2.name} Planetary Pair
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{pair.meaning}</p>
            </CardContent>
          </Card>

          {/* Section 2: Your Archetypal Placements */}
          <Card>
            <CardHeader>
              <CardTitle>Your Archetypal Placements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{pair.planet1.symbol}</span>
                    <span className="text-2xl">{sign1.symbol}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {pair.planet1.name} in {sign1.name}
                  </h3>
                  <p className="text-sm text-primary mt-1">{sign1.archetype}</p>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{pair.planet2.symbol}</span>
                    <span className="text-2xl">{sign2.symbol}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {pair.planet2.name} in {sign2.name}
                  </h3>
                  <p className="text-sm text-primary mt-1">{sign2.archetype}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: The Essence of Your Signs */}
          <Card>
            <CardHeader>
              <CardTitle>The Essence of Your Signs</CardTitle>
              <CardDescription>
                The evolutionary intentions behind your placements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {sign1.symbol} {sign1.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {sign1.evolutionaryTeaching}
                </p>
              </div>
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  {sign2.symbol} {sign2.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {sign2.evolutionaryTeaching}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Ready to receive your personalized synthesis exploring how these archetypes
                  interact within your {pair.planet1.name}/{pair.planet2.name} dynamic?
                </p>

                {/* Token indicator */}
                {!isUnlocked && (
                  <p className="text-sm text-muted-foreground">
                    {remaining > 0 ? (
                      <>
                        <span className="font-medium text-foreground">{remaining}</span> of {maxGenerations} free generations remaining this month
                      </>
                    ) : (
                      <span className="text-amber-600 font-medium">
                        Generation limit reached. Unlock with password to continue.
                      </span>
                    )}
                  </p>
                )}

                {isUnlocked && (
                  <p className="text-sm text-emerald-600 font-medium">
                    Unlimited generations unlocked for this session
                  </p>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Your Synthesis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Synthesis Report
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* AI-GENERATED SECTIONS - Show after generation */}
      {report && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Synthesis Report</CardTitle>
                <CardDescription>
                  {pair.planet1.name} in {sign1?.name} {sign1?.symbol} &{" "}
                  {pair.planet2.name} in {sign2?.name} {sign2?.symbol}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" disabled>
                <FileDown className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground space-y-6">
              {report.split("\n\n").map((section, index) => {
                // Check if section starts with a heading pattern
                if (section.startsWith("## ")) {
                  const [heading, ...content] = section.split("\n");
                  return (
                    <div key={index}>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {heading.replace("## ", "")}
                      </h3>
                      {content.map((para, pIndex) => (
                        <p key={pIndex} className="mb-3 text-muted-foreground leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  );
                }
                // Regular paragraph
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {section}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Limit Modal */}
      <TokenLimitModal
        open={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onUnlock={unlockWithPassword}
        pairName={`${pair.planet1.name}/${pair.planet2.name}`}
      />
    </div>
  );
}
