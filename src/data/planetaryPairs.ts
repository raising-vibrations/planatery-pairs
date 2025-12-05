import { PlanetaryPair } from "@/types";
import { getPlanetById } from "./planetArchetypes";

const sun = getPlanetById("sun")!;
const moon = getPlanetById("moon")!;
const mars = getPlanetById("mars")!;
const venus = getPlanetById("venus")!;
const mercury = getPlanetById("mercury")!;
const jupiter = getPlanetById("jupiter")!;
const saturn = getPlanetById("saturn")!;
const uranus = getPlanetById("uranus")!;

export const planetaryPairs: PlanetaryPair[] = [
  {
    id: "sun-moon",
    slug: "sun-moon",
    planet1: sun,
    planet2: moon,
    theme: "Self-Actualization & Daily Integration",
    meaning: "The Sun/Moon pair represents the need to actualize inherent life purpose day-to-day, giving purpose a face and image. It describes how the person integrates themselves moment to moment, year to year. The Sun represents the soul's evolutionary intent, identity, and core drives for vitality, while the Moon represents the ego and how that purpose is applied and reflected upon daily."
  },
  {
    id: "moon-saturn",
    slug: "moon-saturn",
    planet1: moon,
    planet2: saturn,
    theme: "Ego Integration Within Social Context",
    meaning: "The Moon/Saturn pair governs the ability to integrate ego and personal identity within social systems and culture. It describes the process of establishing personal authority within cultural authority, navigating the tension between individual emotional needs and societal expectations. Saturn represents social conditioning and structure, while the Moon represents personal identity and emotional foundation."
  },
  {
    id: "mars-venus",
    slug: "mars-venus",
    planet1: mars,
    planet2: venus,
    theme: "Self-Completion Through Relationships",
    meaning: "The Mars/Venus pair describes how one completes oneself through relationships. Mars represents the desires of the soul, action, and natural instincts, while Venus represents essential needs, inner relationship with self, and core values. Together they reveal the dynamic of giving and receiving, asserting and attracting, that creates relational wholeness."
  },
  {
    id: "mercury-jupiter",
    slug: "mercury-jupiter",
    planet1: mercury,
    planet2: jupiter,
    theme: "Beliefs, Principles & Communication",
    meaning: "The Mercury/Jupiter pair governs how one establishes beliefs, principles, and philosophies, and creates the intellectual apparatus to explain and communicate them. Mercury handles information gathering, organization, and communication, while Jupiter assimilates, integrates, and seeks truth through expansion. Together they form the bridge between knowledge and wisdom."
  },
  {
    id: "jupiter-saturn",
    slug: "jupiter-saturn",
    planet1: jupiter,
    planet2: saturn,
    theme: "Personal Beliefs vs Cultural Consensus",
    meaning: "The Jupiter/Saturn pair (20-year cycle) describes how personal beliefs harmonize or conflict with cultural consensus patterns, directly impacting the ability to economically survive and thrive within society. Jupiter represents personal beliefs, expansion, and philosophy, while Saturn represents cultural norms, structure, and economic reality. This pair reveals the dance between individual truth and collective agreement.",
    cycle: "20-year cycle"
  },
  {
    id: "saturn-uranus",
    slug: "saturn-uranus",
    planet1: saturn,
    planet2: uranus,
    theme: "Social Structure vs Liberation",
    meaning: "The Saturn/Uranus pair (48-year cycle) is considered the most important planetary cycle by Jeffrey Wolf Green. It establishes the social tone, structure, and order approximately every 48 years, marking the arrival of new social impulses. Saturn represents conditioning, social structure, and conformity, while Uranus represents liberation, breaking free, and essential nature. This pair governs the evolutionary tension between preserving what works and revolutionizing what no longer serves.",
    cycle: "48-year cycle"
  }
];

export function getPlanetaryPairById(id: string): PlanetaryPair | undefined {
  return planetaryPairs.find(pair => pair.id === id);
}

export function getPlanetaryPairBySlug(slug: string): PlanetaryPair | undefined {
  return planetaryPairs.find(pair => pair.slug === slug);
}
