import { atom } from 'jotai';
import type {
  RecommendationPush,
} from '../types/alertTypes';

export const activeRecommendationAtom = atom<RecommendationPush[] >([]);

