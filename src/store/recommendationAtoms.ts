import { atom } from 'jotai';
import type {
  RecommendationPush,
} from '../types/hamel';

export type RecommendationCoordinates = [lng: number, lat: number];

export const activeRecommendationAtom = atom<RecommendationPush[]>([
  {
    event_id: "evt-001",
    // received_alert_time: "2026-06-03T14:32:10Z",
    target: {
      lat: 31.7683,
      lng: 35.2137,
      name: "Enemy Tank Column",
    },

    image_url:
      "https://images.unsplash.com/photo-1511884642898-4c92249e20b6",

    recommended_aircraft_id: "aircraft-f16-01",
    aircraft_type: "F-16",

    urgency_level: "critical",

    rationale:
      "Fastest available aircraft with sufficient payload.",
  },
  {
    event_id: "evt-002",
    received_alert_time: "2026-06-03T14:35:22Z",
    target: {
      lat: 32.0853,
      lng: 34.7818,
      name: "Missile Launcher",
    },

    image_url:
      "https://images.unsplash.com/photo-1548013146-72479768bada",

    recommended_aircraft_id: "aircraft-heron-03",
    aircraft_type: "Heron UAV",

    urgency_level: "critical",

    rationale:
      "Persistent surveillance recommended before strike.",
  },
] as RecommendationPush[]
);
export const activeIdAtom = atom<string | null>(null);

export const activeRecommendationCoordinatesAtom = atom<RecommendationCoordinates | null>((get) => {
  const activeId = get(activeIdAtom);
  if (!activeId) return null;

  const recommendations = get(activeRecommendationAtom);
  for (let index = 0; index < recommendations.length; index += 1) {
    const recommendation = recommendations[index];
    if (recommendation.event_id === activeId) {
      return [recommendation.target.lng, recommendation.target.lat];
    }
  }

  return null;
});
