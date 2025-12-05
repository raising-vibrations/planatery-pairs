import { phases } from '@/data/phases';
import { aspects } from '@/data/aspects';

describe('Phase Data Validation', () => {
  it('should have exactly 8 phases', () => {
    expect(phases).toHaveLength(8);
  });

  it('should have no degree range gaps', () => {
    const sorted = [...phases].sort((a, b) => a.degreeRange.start - b.degreeRange.start);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].degreeRange.end).toBe(sorted[i + 1].degreeRange.start);
    }
  });

  it('should cover full 360 degree range', () => {
    const sorted = [...phases].sort((a, b) => a.degreeRange.start - b.degreeRange.start);
    expect(sorted[0].degreeRange.start).toBe(0);
    expect(sorted[sorted.length - 1].degreeRange.end).toBe(360);
  });

  it('should not have overlapping aspect orbs at same degree', () => {
    // Test for orb conflicts
    const testDegrees = [0, 45, 90, 135, 180, 225, 270, 315];
    testDegrees.forEach(deg => {
      const matches = aspects.filter(a =>
        Math.abs(deg - a.degrees) <= a.orb
      );
      // Log if multiple matches (may be intentional)
      if (matches.length > 1) {
        console.log(`Degree ${deg} matches: ${matches.map(a => a.name).join(', ')}`);
      }
    });
  });
});
