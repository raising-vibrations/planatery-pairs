import type { Aspect } from '@/types';

export const aspects: Aspect[] = [
  { id: 'conjunction', name: 'Conjunction', degrees: 0, orb: 10, category: 'major' },
  { id: 'semi-sextile', name: 'Semi-Sextile', degrees: 30, orb: 3, category: 'minor' },
  { id: 'novile', name: 'Novile', degrees: 40, orb: 2, category: 'minor' },
  { id: 'semisquare', name: 'Semisquare', degrees: 45, orb: 3, category: 'minor' },
  { id: 'septile', name: 'Septile', degrees: 51.25, orb: 2, category: 'minor' },
  { id: 'sextile', name: 'Sextile', degrees: 60, orb: 4, category: 'major' },
  { id: 'quintile', name: 'Quintile', degrees: 72, orb: 3, category: 'minor' },
  { id: 'square', name: 'Square', degrees: 90, orb: 10, category: 'major' },
  { id: 'bi-septile', name: 'Bi-Septile', degrees: 102.5, orb: 2, category: 'minor' },
  { id: 'trine', name: 'Trine', degrees: 120, orb: 10, category: 'major' },
  { id: 'sesquiquadrate', name: 'Sesquiquadrate', degrees: 135, orb: 5, category: 'minor' },
  { id: 'bi-quintile', name: 'Bi-Quintile', degrees: 144, orb: 3, category: 'minor' },
  { id: 'inconjunct', name: 'Inconjunct/Quincunx', degrees: 150, orb: 5, category: 'minor' },
  { id: 'tri-septile', name: 'Tri-Septile', degrees: 154, orb: 2, category: 'minor' },
  { id: 'opposition', name: 'Opposition', degrees: 180, orb: 10, category: 'major' },
];

export function getAspectById(id: string): Aspect | undefined {
  return aspects.find(aspect => aspect.id === id);
}

export function getAspectForDegree(degrees: number): Aspect | null {
  const normalized = ((degrees % 360) + 360) % 360;

  let closestAspect: Aspect | null = null;
  let minDifference = Infinity;

  for (const aspect of aspects) {
    const difference = Math.abs(normalized - aspect.degrees);
    if (difference <= aspect.orb && difference < minDifference) {
      closestAspect = aspect;
      minDifference = difference;
    }
  }

  return closestAspect;
}
