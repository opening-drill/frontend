export interface Location {
  lng: number;
  lat: number;
}


export type UrgencyLevel = 'low' | 'high' | 'critical';

export interface RecommendationPush {
  event_id: string;
  target: Location & { name?: string };
  image_url: string;
  recommended_aircraft_id: string;
  aircraft_type: string;
  urgency_level: UrgencyLevel;
  rationale?: string;
}
export interface AlertData extends RecommendationPush {
  received_alert_time: string;
}