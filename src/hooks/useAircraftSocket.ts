import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import {
  aircraftsAtom,
  zonesAtom,
  dispatchesAtom,
  violationsAtom,
} from '../store/aircraftAtoms';
import {
  initializeLiveSocket,
  disconnectLiveSocket,
} from '../core/server/socket';
import type {
  Snapshot,
  AircraftBatch,
  AircraftLive,
  Zone,
  DispatchLive,
  GeoViolationPush,
} from '../types/aircraft';

export const useAircraftSocket = (): void => {
  const setAircrafts = useSetAtom(aircraftsAtom);
  const setZones = useSetAtom(zonesAtom);
  const setDispatches = useSetAtom(dispatchesAtom);
  const setViolations = useSetAtom(violationsAtom);

  useEffect((): (() => void) => {
    const liveSocket = initializeLiveSocket();

    const handleSnapshot = (snapshot: Snapshot): void => {
      // Handles new snapshot by completely wiping/overriding the old state
      const initialAircraftMap: Record<string, AircraftLive> = {};
      snapshot.aircrafts.forEach((aircraft) => {
        initialAircraftMap[aircraft.aircraft_id] = aircraft;
      });
      setAircrafts(initialAircraftMap);

      const initialZonesMap: Record<string, Zone> = {};
      snapshot.zones.forEach((zone) => {
        initialZonesMap[zone.zone_id] = zone;
      });
      setZones(initialZonesMap);

      const initialDispatchesMap: Record<string, DispatchLive> = {};
      snapshot.dispatches.forEach((dispatch) => {
        initialDispatchesMap[dispatch.aircraft_id] = dispatch;
      });
      setDispatches(initialDispatchesMap);

      // Reset violations on new snapshot connect
      setViolations([]);
    };

    const handleBatch = (batch: AircraftBatch): void => {
      // Merges updates into existing map state by aircraft_id
      setAircrafts((current) => {
        const next = { ...current };
        batch.updates.forEach((aircraft) => {
          next[aircraft.aircraft_id] = aircraft;
        });
        return next;
      });
    };

    const handleZoneAdd = (zone: Zone): void => {
      setZones((current) => ({
        ...current,
        [zone.zone_id]: zone,
      }));
    };

    const handleZoneRemove = (payload: { zone_id: string }): void => {
      setZones((current) => {
        const next = { ...current };
        delete next[payload.zone_id];
        return next;
      });
    };

    const handleDispatchUpdate = (dispatch: DispatchLive): void => {
      setDispatches((current) => ({
        ...current,
        [dispatch.aircraft_id]: dispatch,
      }));
    };

    const handleGeoViolation = (payload: GeoViolationPush): void => {
      setViolations(payload.violations);
    };

    liveSocket.on('snapshot', handleSnapshot);
    liveSocket.on('aircraft:batch', handleBatch);
    liveSocket.on('zone:add', handleZoneAdd);
    liveSocket.on('zone:remove', handleZoneRemove);
    liveSocket.on('dispatch:update', handleDispatchUpdate);
    liveSocket.on('geo:violation', handleGeoViolation);

    return (): void => {
      liveSocket.off('snapshot', handleSnapshot);
      liveSocket.off('aircraft:batch', handleBatch);
      liveSocket.off('zone:add', handleZoneAdd);
      liveSocket.off('zone:remove', handleZoneRemove);
      liveSocket.off('dispatch:update', handleDispatchUpdate);
      liveSocket.off('geo:violation', handleGeoViolation);
      disconnectLiveSocket();
    };
  }, [setAircrafts, setZones, setDispatches, setViolations]);
};
