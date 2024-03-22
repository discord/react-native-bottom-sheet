import { useCallback, useEffect } from 'react';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import type { SCROLLABLE_TYPE } from '../constants';

export const useScrollableSetter = (
  type: SCROLLABLE_TYPE,
  refreshable: boolean,
  useFocusHook = useEffect
) => {
  // hooks
  const {
    animatedScrollableType,
    isContentHeightFixed,
    isScrollableRefreshable,
  } = useBottomSheetInternal();

  // callbacks
  const handleSettingScrollable = useCallback(() => {
    animatedScrollableType.value = type;
    isScrollableRefreshable.value = refreshable;
    isContentHeightFixed.value = false;
  }, [
    type,
    refreshable,
    animatedScrollableType,
    isScrollableRefreshable,
    isContentHeightFixed,
  ]);

  // effects
  useFocusHook(handleSettingScrollable);
};
