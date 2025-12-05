import { PairExplorer } from "@/components/PairExplorer";
import { getPlanetaryPairBySlug } from "@/data/planetaryPairs";
import { notFound } from "next/navigation";

export default function JupiterSaturnPage() {
  const pair = getPlanetaryPairBySlug("jupiter-saturn");
  if (!pair) notFound();

  return <PairExplorer pair={pair} />;
}
