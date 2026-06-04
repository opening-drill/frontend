import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { activeRecommendationAtom } from '../store/recommendationAtoms';
import {
  disconnectLiveSocket,
  initializeLiveSocket,
} from '../core/server/socket';
import type {
  RecommendationPush,
} from '../types/alertTypes';

export const useHamelSocket = (): void => {
  const setActiveRecommendation = useSetAtom(activeRecommendationAtom);

  useEffect((): (() => void) => {
    const liveSocket = initializeLiveSocket();

    const handleRecommendation = (
      recommendation: RecommendationPush,
    ): void => {
      setActiveRecommendation((currentQueue) => [...currentQueue, recommendation]);
    };

    liveSocket.on('recommendation:new', handleRecommendation);

    return (): void => {
      liveSocket.off('recommendation:new', handleRecommendation);
      disconnectLiveSocket();
    };
  }, [setActiveRecommendation]);
};
