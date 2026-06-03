import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { aircraftsAtom } from '../store/aircraftAtoms';
import {
  initializeLiveSocket,
  disconnectLiveSocket,
} from '../core/server/socket';
import type { Snapshot, AircraftBatch, AircraftLive } from '../types/aircraft';

export const useAircraftSocket = (): void => {
  const setAircrafts = useSetAtom(aircraftsAtom);

  useEffect((): (() => void) => {
    const liveSocket = initializeLiveSocket();

    const handleSnapshot = (snapshot: Snapshot): void => {
      // Handles new snapshot by completely wiping/overriding the old aircraft state, not appending to it
      const initialAircraftMap: Record<string, AircraftLive> = {};
      snapshot.aircrafts.forEach((aircraft) => {
        initialAircraftMap[aircraft.aircraft_id] = aircraft;
      });
      setAircrafts(initialAircraftMap);
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

    liveSocket.on('snapshot', handleSnapshot);
    liveSocket.on('aircraft:batch', handleBatch);

    return (): void => {
      liveSocket.off('snapshot', handleSnapshot);
      liveSocket.off('aircraft:batch', handleBatch);
      disconnectLiveSocket();
    };
  }, [setAircrafts]);
};
