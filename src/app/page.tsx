import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { planetaryPairs } from "@/data/planetaryPairs";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Evolutionary Astrology
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Planetary Pair Journey
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore Jeffrey Wolf Green&apos;s 6 Key Planetary Pairs. Discover how
            these cosmic dialogues shape your evolutionary path and unlock
            deeper insights for your unique chart placements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/sign-in">
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Pairs Preview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          The 6 Key Planetary Pairs
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {planetaryPairs.map((pair) => (
            <Card key={pair.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-3xl mb-3">
                  <span>{pair.planet1.symbol}</span>
                  <span>{pair.planet2.symbol}</span>
                </div>
                <h3 className="font-semibold text-foreground">
                  {pair.planet1.name}/{pair.planet2.name}
                </h3>
                <p className="text-sm text-primary mt-1">{pair.theme}</p>
                {pair.cycle && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {pair.cycle}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Choose a Pair
              </h3>
              <p className="text-sm text-muted-foreground">
                Select one of the 6 key planetary pairs that resonates with your
                current inquiry.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Enter Your Signs
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the zodiac signs for each planet based on your natal
                chart.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Receive Insights
              </h3>
              <p className="text-sm text-muted-foreground">
                Receive a personalized synthesis report combining the archetypes
                for your unique configuration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Ready to Explore Your Cosmic Blueprint?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join our community and start generating personalized synthesis reports
          for your planetary pairs.
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            Based on the teachings of Jeffrey Wolf Green&apos;s Evolutionary
            Astrology
          </p>
        </div>
      </footer>
    </div>
  );
}
