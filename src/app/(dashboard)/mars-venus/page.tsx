import { PairExplorer } from "@/components/PairExplorer";
import { getPlanetaryPairBySlug } from "@/data/planetaryPairs";
import { notFound } from "next/navigation";

export default function MarsVenusPage() {
  const pair = getPlanetaryPairBySlug("mars-venus");
  if (!pair) notFound();

  return <PairExplorer pair={pair} />;
}
