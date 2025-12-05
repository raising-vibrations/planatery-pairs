"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { phases } from '@/data/phases';
import { aspects } from '@/data/aspects';
import { calculatePhaseAndAspect } from '@/lib/phaseCalculator';

export default function UnderstandingPhasesAspectsPage() {
  const [degreeInput, setDegreeInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculatePhaseAndAspect> | null>(null);

  const handleCalculate = (value: string) => {
    setDegreeInput(value);
    const num = parseFloat(value);

    if (value && !isNaN(num)) {
      const calculated = calculatePhaseAndAspect(num);
      setResult(calculated);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Understanding Planetary Phases & Aspects
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn how lunar phases reveal the evolutionary stage of planetary relationships
        </p>
      </div>

      {/* Interactive Calculator */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Phase Calculator</CardTitle>
          <CardDescription>
            Enter the degree separation between two planets to discover their phase and aspect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="degree-input">Degree Separation (0-360°)</Label>
            <Input
              id="degree-input"
              type="number"
              min="0"
              max="360"
              placeholder="e.g., 150"
              value={degreeInput}
              onChange={(e) => handleCalculate(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {result && result.phase && (
            <div className="pt-4 space-y-4">
              <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">
                      {result.phase.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.phase.zodiacSign} · {result.phase.element} Element
                    </p>
                  </div>
                  <Badge variant={result.phase.element === 'Yang' ? 'default' : 'secondary'}>
                    {result.phase.element}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {result.phase.keyword}
                </p>
                <p className="text-sm leading-relaxed">
                  {result.phase.description}
                </p>
              </div>

              {result.aspect && (
                <div className="p-3 border rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Associated Aspect</p>
                  <p className="text-sm text-muted-foreground">
                    {result.aspect.name} ({result.aspect.degrees}°)
                    {result.degreeFromAspect !== null && (
                      <span className="ml-1">
                        · {result.degreeFromAspect.toFixed(1)}° from exact
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    The aspect is the measurement tool—the phase contains the evolutionary wisdom
                  </p>
                </div>
              )}

              {result.message && (
                <p className="text-sm text-muted-foreground italic">
                  {result.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Phases: The Evolutionary Knowledge</h3>
            <p className="text-sm text-muted-foreground">
              The 8 lunar phases represent different stages in the evolutionary cycle between two planets.
              Each phase describes a specific developmental stage of consciousness, revealing where you are
              in your journey with these planetary energies.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Aspects: The Measurement Tools</h3>
            <p className="text-sm text-muted-foreground">
              Aspects (conjunction, square, trine, etc.) are simply degree measurements that help us identify
              which phase applies. While traditional astrology focuses on aspect interpretation, evolutionary
              astrology uses aspects primarily to determine the phase.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* All 8 Phases Reference */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">The 8 Evolutionary Phases</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {phases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{phase.name}</CardTitle>
                    <CardDescription>
                      {phase.degreeRange.start}° - {phase.degreeRange.end}°
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={phase.element === 'Yang' ? 'default' : 'secondary'} className="text-xs">
                      {phase.element}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{phase.zodiacSign}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-primary">{phase.evolutionaryFocus}</p>
                <p className="text-xs text-muted-foreground">{phase.keyword}</p>
                <p className="text-sm leading-relaxed">{phase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Aspects Reference Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Aspect Reference</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-4 font-semibold text-sm border-b pb-2">
                <div>Aspect</div>
                <div>Degrees</div>
                <div>Orb</div>
                <div>Type</div>
              </div>
              {aspects.map((aspect) => (
                <div key={aspect.id} className="grid grid-cols-4 gap-4 text-sm py-2 border-b last:border-0">
                  <div>{aspect.name}</div>
                  <div>{aspect.degrees}°</div>
                  <div>±{aspect.orb}°</div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {aspect.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium">Sun/Moon at 150° separation</p>
            <p className="text-sm text-muted-foreground">
              → <strong>Gibbous Phase</strong> (Virgo, Yin): Re-evaluating egocentric patterns.
              The aspect measurement (Inconjunct/Quincunx at 150°) tells us this is the Gibbous phase,
              where old ways are no longer working and adjustment is needed.
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Mars/Venus at 90° separation</p>
            <p className="text-sm text-muted-foreground">
              → <strong>First Quarter Phase</strong> (Gemini, Yang): Building foundations through action.
              The square aspect (90°) indicates the First Quarter phase, a time of crisis in action
              and making concrete choices about what form to take.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Using This Feature */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle>Using This in Your Synthesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            When exploring planetary pairs, you can optionally enter the degree separation between
            your planets to receive a phase-specific synthesis. The phase context will be woven
            throughout the interpretation, revealing where you are in the evolutionary journey
            between these two planetary energies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
