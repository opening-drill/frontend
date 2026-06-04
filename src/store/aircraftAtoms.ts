import { atom } from 'jotai';
import type { AircraftLive, Zone, DispatchLive, GeoViolation } from '../types/aircraft';

export const aircraftsAtom = atom<Record<string, AircraftLive>>({});
export const zonesAtom = atom<Record<string, Zone>>({});
export const dispatchesAtom = atom<Record<string, DispatchLive>>({});
export const violationsAtom = atom<GeoViolation[]>([]);
