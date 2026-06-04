import { useAtomValue } from 'jotai';
import {
  aircraftsAtom,
  zonesAtom,
  dispatchesAtom,
  violationsAtom,
} from '../store/aircraftAtoms';
import type { AircraftLive, Zone, DispatchLive, GeoViolation } from '../types/aircraft';

interface UseAircraftsReturn {
  aircraftsMap: Record<string, AircraftLive>;
  aircrafts: AircraftLive[];
  getAircraftById: (id: string) => AircraftLive | undefined;
  getAircraftLocation: (id: string) => { lng: number; lat: number } | undefined;
  getAircraftsByType: (type: string) => AircraftLive[];
  getAircraftsByStatus: (status: AircraftLive['status']) => AircraftLive[];

  // Zones
  zonesMap: Record<string, Zone>;
  zones: Zone[];
  getZoneById: (id: string) => Zone | undefined;

  // Dispatches
  dispatchesMap: Record<string, DispatchLive>;
  dispatches: DispatchLive[];
  getDispatchByAircraftId: (aircraftId: string) => DispatchLive | undefined;

  // Violations
  violations: GeoViolation[];
}

/**
 * Hook to retrieve and query live map data (aircraft, zones, dispatches, violations)
 * updated from the WebSocket connection.
 */
export const useAircrafts = (): UseAircraftsReturn => {
  const aircraftsMap = useAtomValue(aircraftsAtom);
  const zonesMap = useAtomValue(zonesAtom);
  const dispatchesMap = useAtomValue(dispatchesAtom);
  const violations = useAtomValue(violationsAtom);

  // Aircraft Selectors
  const getAircraftById = (id: string): AircraftLive | undefined => {
    return aircraftsMap[id];
  };

  const getAircraftLocation = (id: string): { lng: number; lat: number } | undefined => {
    return aircraftsMap[id]?.location;
  };

  const getAircraftsByType = (type: string): AircraftLive[] => {
    return Object.values(aircraftsMap).filter(
      (aircraft) => aircraft.aircraft_type.toLowerCase() === type.toLowerCase()
    );
  };

  const getAircraftsByStatus = (status: AircraftLive['status']): AircraftLive[] => {
    return Object.values(aircraftsMap).filter(
      (aircraft) => aircraft.status === status
    );
  };

  // Zone Selectors
  const getZoneById = (id: string): Zone | undefined => {
    return zonesMap[id];
  };

  // Dispatch Selectors
  const getDispatchByAircraftId = (aircraftId: string): DispatchLive | undefined => {
    return dispatchesMap[aircraftId];
  };

  return {
    aircraftsMap,
    aircrafts: Object.values(aircraftsMap),
    getAircraftById,
    getAircraftLocation,
    getAircraftsByType,
    getAircraftsByStatus,

    zonesMap,
    zones: Object.values(zonesMap),
    getZoneById,

    dispatchesMap,
    dispatches: Object.values(dispatchesMap),
    getDispatchByAircraftId,

    violations,
  };
};
