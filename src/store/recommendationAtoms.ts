import { atom } from 'jotai';
import type {
  AlertData,
} from '../types/hamel';

export const activeRecommendationAtom = atom<AlertData[] >([]);

