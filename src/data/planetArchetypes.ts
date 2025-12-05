import { Planet } from "@/types";

export const planets: Planet[] = [
  {
    id: "sun",
    name: "Sun",
    symbol: "\u2609",
    archetype: "Soul's Evolutionary Intent",
    description: "The Sun represents the soul's evolutionary intent, identity, and core drives for vitality. It is the essential life force, the center of creative purpose, and the light that illuminates one's path of becoming."
  },
  {
    id: "moon",
    name: "Moon",
    symbol: "\u263D",
    archetype: "Ego & Daily Integration",
    description: "The Moon represents the ego, how purpose is applied daily, and self-reflection. It is the vessel through which the soul's intent is given a face and image, moment to moment, year to year."
  },
  {
    id: "mercury",
    name: "Mercury",
    symbol: "\u263F",
    archetype: "Information & Communication",
    description: "Mercury governs information gathering, organization, and short-term memory. It is the messenger that bridges inner knowing with outer expression, facilitating the exchange of ideas and understanding."
  },
  {
    id: "venus",
    name: "Venus",
    symbol: "\u2640",
    archetype: "Essential Needs & Values",
    description: "Venus represents essential needs, inner relationship with self, and core values. It governs what we are drawn to, what we find beautiful, and how we relate to ourselves and others in intimacy."
  },
  {
    id: "mars",
    name: "Mars",
    symbol: "\u2642",
    archetype: "Desires & Action",
    description: "Mars embodies the desires of the soul, action, and natural instincts. It is the driving force that propels us forward, the courage to assert our needs, and the fire that ignites pursuit."
  },
  {
    id: "jupiter",
    name: "Jupiter",
    symbol: "\u2643",
    archetype: "Expansion & Truth-Seeking",
    description: "Jupiter governs assimilation, integration, and truth-seeking expansion. It is the principle of growth, the quest for meaning, and the synthesis of experience into wisdom and understanding."
  },
  {
    id: "saturn",
    name: "Saturn",
    symbol: "\u2644",
    archetype: "Structure & Conditioning",
    description: "Saturn represents social conditioning, structure, and the boundaries of consciousness. It is the teacher through limitation, establishing the framework within which the soul matures and masters its purpose."
  },
  {
    id: "uranus",
    name: "Uranus",
    symbol: "\u2645",
    archetype: "Liberation & Essential Nature",
    description: "Uranus embodies liberation, breaking free, and essential nature. It is the revolutionary impulse that shatters outdated structures, awakening the soul to its authentic individuality beyond conditioning."
  }
];

export function getPlanetById(id: string): Planet | undefined {
  return planets.find(planet => planet.id === id);
}
