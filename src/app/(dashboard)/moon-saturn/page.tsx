import { PairExplorer } from "@/components/PairExplorer";
import { getPlanetaryPairBySlug } from "@/data/planetaryPairs";
import { notFound } from "next/navigation";

export default function MoonSaturnPage() {
  const pair = getPlanetaryPairBySlug("moon-saturn");
  if (!pair) notFound();

  return <PairExplorer pair={pair} />;
}
