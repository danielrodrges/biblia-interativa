/**
 * Hook para feedback visual de swipe lateral
 */

import { useState, useCallback } from 'react';

export function useSwipeIndicator() {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const showSwipeLeft = useCallback(() => {
    setSwipeDirection('left');
    setTimeout(() => setSwipeDirection(null), 300);
  }, []);

  const showSwipeRight = useCallback(() => {
    setSwipeDirection('right');
    setTimeout(() => setSwipeDirection(null), 300);
  }, []);

  return {
    swipeDirection,
    showSwipeLeft,
    showSwipeRight,
  };
}
