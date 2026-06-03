import { atom } from 'jotai';
import type { AircraftLive } from '../types/aircraft';

export const aircraftsAtom = atom<Record<string, AircraftLive>>({});
