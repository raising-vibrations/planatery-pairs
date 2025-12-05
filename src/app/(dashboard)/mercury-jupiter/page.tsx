import { PairExplorer } from "@/components/PairExplorer";
import { getPlanetaryPairBySlug } from "@/data/planetaryPairs";
import { notFound } from "next/navigation";

export default function MercuryJupiterPage() {
  const pair = getPlanetaryPairBySlug("mercury-jupiter");
  if (!pair) notFound();

  return <PairExplorer pair={pair} />;
}
