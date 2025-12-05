import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { planetaryPairs } from "@/data/planetaryPairs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to Planetary Pairs
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Explore Jeffrey Wolf Green&apos;s 6 Key Planetary Pairs. Select a pair,
          choose your zodiac sign placements, and receive personalized reports
          synthesizing the archetypes for your evolutionary journey.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {planetaryPairs.map((pair) => (
          <Link key={pair.id} href={`/${pair.slug}`}>
            <Card className="h-full transition-all hover:border-primary hover:shadow-md cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{pair.planet1.symbol}</span>
                  <span className="text-2xl">{pair.planet2.symbol}</span>
                </div>
                <CardTitle className="text-lg">
                  {pair.planet1.name}/{pair.planet2.name}
                </CardTitle>
                <CardDescription>{pair.theme}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {pair.meaning}
                </p>
                {pair.cycle && (
                  <p className="mt-2 text-xs font-medium text-primary">
                    {pair.cycle}
                  </p>
                )}
                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About the 6 Key Planetary Pairs</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <p>
            According to Jeffrey Wolf Green&apos;s evolutionary astrology, these six
            planetary pairs represent fundamental dynamics in the human psyche
            and our collective evolution. Each pair creates a dialogue between
            two planetary archetypes that together illuminate key themes in our
            lives.
          </p>
          <p className="mt-4">
            By understanding how these pairs manifest through your specific
            zodiac sign placements, you gain insight into your unique
            evolutionary journey and the themes you&apos;re here to work with in
            this lifetime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
