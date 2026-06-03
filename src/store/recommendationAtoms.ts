import { atom } from 'jotai';
import type {
  RecommendationPush,
} from '../types/hamel';

export const activeRecommendationAtom = atom<RecommendationPush[] >([]);

