import { getAspectForDegree } from '@/data/aspects';
import { getPhaseForDegree } from '@/data/phases';
import type { PhaseAspectResult } from '@/types';

export function calculatePhaseAndAspect(degreeSeparation: number): PhaseAspectResult {
  // Normalize degrees to 0-360
  const normalizedDegree = ((degreeSeparation % 360) + 360) % 360;

  // Find phase (PRIMARY)
  const phase = getPhaseForDegree(normalizedDegree);

  // Find closest aspect within orb (SECONDARY)
  const aspect = getAspectForDegree(normalizedDegree);

  // Calculate exactness
  const degreeFromAspect = aspect
    ? Math.abs(normalizedDegree - aspect.degrees)
    : null;

  const isExact = degreeFromAspect !== null && degreeFromAspect < 1;

  // Generate user message if needed
  let message: string | undefined;
  if (!phase) {
    message = "Degree out of valid range (0-360)";
  } else if (!aspect) {
    message = "No specific aspect detected (between major aspects)";
  }

  return {
    phase,
    aspect,
    isExact,
    degreeFromAspect,
    message,
  };
}
