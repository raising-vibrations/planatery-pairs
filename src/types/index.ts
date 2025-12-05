export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  keywords: string[];
  archetype: string;
  essence: string;
  evolutionaryTeaching: string;
  shadowAspects: string[];
}

export interface Planet {
  id: string;
  name: string;
  symbol: string;
  archetype: string;
  description: string;
}

export interface PlanetaryPair {
  id: string;
  slug: string;
  planet1: Planet;
  planet2: Planet;
  theme: string;
  meaning: string;
  cycle?: string;
}

export interface Aspect {
  id: string;
  name: string;
  symbol?: string;
  degrees: number;
  orb: number;
  category: 'major' | 'minor';
}

export interface Phase {
  id: string;
  name: string;
  zodiacSign: string;
  element: 'Yang' | 'Yin';
  degreeRange: { start: number; end: number };
  keyword: string;
  description: string;
  evolutionaryFocus: string;
}

export interface PhaseAspectResult {
  phase: Phase | null;
  aspect: Aspect | null;
  isExact: boolean;
  degreeFromAspect: number | null;
  message?: string;
}

export interface ReportRequest {
  pairId: string;
  planet1Sign: string;
  planet2Sign: string;
  degreeSeparation?: number;
}

export interface GeneratedReport {
  content: string;
  pairId: string;
  planet1Sign: string;
  planet2Sign: string;
  generatedAt: Date;
}
