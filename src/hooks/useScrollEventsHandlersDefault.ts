import { useWorkletCallback } from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import type {
  ScrollEventsHandlersHookType,
  ScrollEventHandlerCallbackType,
} from '../types';

export type ScrollEventContextType = {};

export const useScrollEventsHandlers: ScrollEventsHandlersHookType = () => {
  // hooks
  const { isScrollHandled, animatedScrollableContentOffsetY: scrollY } =
    useBottomSheetInternal();

  //#region callbacks
  const handleOnScroll: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      (event, _) => {
        scrollY.value = event.contentOffset.y;
      },
      [scrollY]
    );

  const handleOnBeginDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      (__, _) => {
        //isScrollHandled.value = true;
      },
      [isScrollHandled]
    );

  const handleOnEndDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      (__, _) => {
        //scrollY.value = event.contentOffset.y;
        //isScrollHandled.value = false;
      },
      [isScrollHandled, scrollY]
    );

  const handleOnMomentumEnd: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback((__, _) => {}, []);
  //#endregion

  return {
    handleOnScroll,
    handleOnBeginDrag,
    handleOnEndDrag,
    handleOnMomentumEnd,
  };
};
