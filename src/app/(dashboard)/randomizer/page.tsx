"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { planetaryPairs } from "@/data/planetaryPairs";
import { Dices, Sparkles } from "lucide-react";

export default function RandomizerPage() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPair, setSelectedPair] = useState<typeof planetaryPairs[0] | null>(null);

  const spinAnimation = useCallback(() => {
    let spins = 0;
    const totalSpins = 20 + Math.floor(Math.random() * 10);
    const finalIndex = Math.floor(Math.random() * planetaryPairs.length);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % planetaryPairs.length);
      spins++;

      if (spins >= totalSpins) {
        clearInterval(interval);
        setCurrentIndex(finalIndex);
        setSelectedPair(planetaryPairs[finalIndex]);
        setIsSpinning(false);
      }
    }, 100 + spins * 10);

    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    setIsSpinning(true);
    setSelectedPair(null);
    spinAnimation();
  };

  const handleExplore = () => {
    if (selectedPair) {
      router.push(`/${selectedPair.slug}`);
    }
  };

  const displayPair = selectedPair || planetaryPairs[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-2">
        <Dices className="h-12 w-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Cosmic Randomizer</h1>
        <p className="text-muted-foreground max-w-md">
          Let the universe choose your planetary pair for today&apos;s exploration.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className={`flex items-center justify-center gap-4 text-6xl transition-all duration-100 ${
              isSpinning ? "animate-pulse" : ""
            }`}
          >
            <span>{displayPair.planet1.symbol}</span>
            <span>{displayPair.planet2.symbol}</span>
          </div>
          <CardTitle className="text-2xl mt-4">
            {displayPair.planet1.name}/{displayPair.planet2.name}
          </CardTitle>
          <CardDescription>{displayPair.theme}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {selectedPair && !isSpinning && (
            <div className="bg-secondary/50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                The universe has chosen {selectedPair.planet1.name}/
                {selectedPair.planet2.name} for you today
                <Sparkles className="h-4 w-4" />
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              size="lg"
              className="w-full"
            >
              <Dices className="mr-2 h-5 w-5" />
              {isSpinning ? "Spinning..." : "Spin the Cosmic Dice"}
            </Button>

            {selectedPair && !isSpinning && (
              <Button
                onClick={handleExplore}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore This Pair
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 opacity-50">
        {planetaryPairs.map((pair) => (
          <div
            key={pair.id}
            className={`text-center p-2 rounded-lg transition-all ${
              displayPair.id === pair.id
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-secondary/30"
            }`}
          >
            <span className="text-lg">
              {pair.planet1.symbol}
              {pair.planet2.symbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
