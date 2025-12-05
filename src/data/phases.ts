import type { Phase } from '@/types';

export const phases: Phase[] = [
  {
    id: 'new',
    name: 'New Phase',
    zodiacSign: 'Aries',
    element: 'Yang',
    degreeRange: { start: 0, end: 45 },
    keyword: 'Initiation Beginning',
    evolutionaryFocus: 'Instinctual action and self-discovery',
    description: 'The beginning of a cycle. Action is instinctual. Absolute freedom is required. The question is, "Who am I?" The actions one takes brings feedback.',
  },
  {
    id: 'crescent',
    name: 'Crescent Phase',
    zodiacSign: 'Taurus',
    element: 'Yin',
    degreeRange: { start: 45, end: 90 },
    keyword: 'Internalization of New Phase, Withdrawal, Struggle',
    evolutionaryFocus: 'Withdrawing to understand identity',
    description: 'The feedback has been obtained. The need is to withdraw and to come to an understanding of who one is.',
  },
  {
    id: 'first-quarter',
    name: 'First Quarter Phase',
    zodiacSign: 'Gemini',
    element: 'Yang',
    degreeRange: { start: 90, end: 135 },
    keyword: 'Choices to be Made, Crisis in Action',
    evolutionaryFocus: 'Building foundations through action',
    description: 'One now has an understanding of who one is. Now the question is, "What specific form do I take?" A time of intense activity. Building one\'s foundations in terms of who one is.',
  },
  {
    id: 'gibbous',
    name: 'Gibbous Phase',
    zodiacSign: 'Virgo',
    element: 'Yin',
    degreeRange: { start: 135, end: 180 },
    keyword: 'Humbling and Adjusting',
    evolutionaryFocus: 'Re-evaluating egocentric patterns',
    description: 'The old (egocentric) ways are no longer working. The need to re-evaluate. The realization that it is not about "me" anymore.',
  },
  {
    id: 'full',
    name: 'Full Phase',
    zodiacSign: 'Libra',
    element: 'Yang',
    degreeRange: { start: 180, end: 225 },
    keyword: 'Entering the Social Sphere, Socialization',
    evolutionaryFocus: 'Integrating purpose into social sphere',
    description: 'The dilemma is now in the full light of day. This is me vs what is required of me in the social sphere. Comparing and contrasting self to everyone else. The necessary feedback from significant others in one\'s life to begin the process of integrating oneself/one\'s sense of purpose into the social sphere.',
  },
  {
    id: 'disseminating',
    name: 'Disseminating Phase',
    zodiacSign: 'Capricorn',
    element: 'Yin',
    degreeRange: { start: 225, end: 270 },
    keyword: 'Totality of Society, Integration of Purpose',
    evolutionaryFocus: 'Contributing learned wisdom to society',
    description: 'Fully integrating oneself/one\'s sense of purpose into the social sphere. What has been learned enters the mainstream.',
  },
  {
    id: 'last-quarter',
    name: 'Last Quarter Phase',
    zodiacSign: 'Aquarius',
    element: 'Yang',
    degreeRange: { start: 270, end: 315 },
    keyword: 'Breaking Free, Rebelling from All That Has Come Before, Crisis in Belief',
    evolutionaryFocus: 'Detaching from conditioned beliefs',
    description: 'Questioning the underlying beliefs that have underpinned all prior actions. Detaching from what one has created and the social sphere in which one has participated.',
  },
  {
    id: 'balsamic',
    name: 'Balsamic Phase',
    zodiacSign: 'Pisces',
    element: 'Yin',
    degreeRange: { start: 315, end: 360 },
    keyword: 'Culmination of the Entire Cycle, It Dissolves Back Into From Whence It Came',
    evolutionaryFocus: 'Spiritual completion and dissolution',
    description: 'Attunement to the Divine. Understanding oneself in the context of the Divine and the corresponding expansion of consciousness. Letting go of all that has come before that hinders this attunement. The beginnings of new imaginings for a new cycle.',
  },
];

export function getPhaseById(id: string): Phase | undefined {
  return phases.find(phase => phase.id === id);
}

export function getPhaseForDegree(degrees: number): Phase | null {
  const normalized = ((degrees % 360) + 360) % 360;
  return phases.find(p =>
    normalized >= p.degreeRange.start &&
    normalized < p.degreeRange.end
  ) || null;
}
