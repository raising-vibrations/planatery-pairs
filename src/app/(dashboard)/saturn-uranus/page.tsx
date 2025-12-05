import { PairExplorer } from "@/components/PairExplorer";
import { getPlanetaryPairBySlug } from "@/data/planetaryPairs";
import { notFound } from "next/navigation";

export default function SaturnUranusPage() {
  const pair = getPlanetaryPairBySlug("saturn-uranus");
  if (!pair) notFound();

  return <PairExplorer pair={pair} />;
}
