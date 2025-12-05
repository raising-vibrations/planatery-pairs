import { PairExplorer } from "@/components/PairExplorer";
import { getPlanetaryPairBySlug } from "@/data/planetaryPairs";
import { notFound } from "next/navigation";

export default function SunMoonPage() {
  const pair = getPlanetaryPairBySlug("sun-moon");
  if (!pair) notFound();

  return <PairExplorer pair={pair} />;
}
