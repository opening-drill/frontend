export interface AircraftLive {
  aircraft_id: string;
  aircraft_type: string;         // e.g., 'recon' | 'strike' | 'F-15'
  location: { lng: number; lat: number }; // WGS84 GeoJSON format [lng, lat]
  altitude: number;
  heading_degrees: number;
  horizontal_speed_mps: number;
  status: 'free' | 'busy' | 'broken';
  ts: string; // ISO-8601 UTC
}

export interface Zone {
  zone_id: string;
  name: string;
  area: { type: 'Polygon'; coordinates: number[][][] }; // GeoJSON [lng, lat]
  zone_type: 'dangerous' | 'safe' | 'no_attack';
}

export interface DispatchLive {
  event_id: string;
  aircraft_id: string;
  origin: { lng: number; lat: number };
  target: { lng: number; lat: number };
  location: { lng: number; lat: number }; // current location
  phase: 'enroute' | 'arrived' | 'struck' | 'aborted';
  eta_seconds: number;
}

export interface Snapshot {
  aircrafts: AircraftLive[];
  zones: Zone[];
  dispatches: DispatchLive[];
  ts: string;
}

export interface AircraftBatch {
  updates: AircraftLive[];
  ts: string;
}
