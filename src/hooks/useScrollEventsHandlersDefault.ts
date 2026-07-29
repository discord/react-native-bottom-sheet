import { State } from 'react-native-gesture-handler';
import { scrollTo, useWorkletCallback, useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { ANIMATION_STATE, SCROLLABLE_STATE, SHEET_STATE } from '../constants';
import type {
  ScrollEventHandlerCallbackType,
  ScrollEventsHandlersHookType,
} from '../types';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export type ScrollEventContextType = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

export const useScrollEventsHandlersDefault: ScrollEventsHandlersHookType = (
  scrollableRef,
  scrollableContentOffsetY,
  lockableScrollableContentOffsetY
) => {
  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedAnimationState,
    animatedHandleGestureState,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY,
  } = useBottomSheetInternal();

  const _lockableScrollableContentOffsetY = useSharedValue(0);

  /**
   * `scrollTo` is a synchronous UI-thread call, and on the new renderer a
   * non-animated one re-emits `onScroll` and `onMomentumScrollEnd` before
   * returning. that re-enters the scroll locks below and overflows the native
   * stack, so we suppress nested calls and let the outermost one finish.
   */
  const isLockingScroll = useSharedValue(false);

  useAnimatedReaction(
    () => _lockableScrollableContentOffsetY.value,
    _lockableScrollableContentOffsetY => {
      if (lockableScrollableContentOffsetY) {
        lockableScrollableContentOffsetY.value = _lockableScrollableContentOffsetY;
      }
    }
  );

  //#region callbacks
  const handleOnScroll: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
        /**
         * if sheet position is extended or fill parent, then we reset
         * `shouldLockInitialPosition` value to false.
         */
        if (
          animatedSheetState.value === SHEET_STATE.EXTENDED ||
          animatedSheetState.value === SHEET_STATE.FILL_PARENT
        ) {
          context.shouldLockInitialPosition = false;
        }

        /**
         * if handle gesture state is active, then we capture the offset y position
         * and lock the scrollable with it.
         */
        if (animatedHandleGestureState.value === State.ACTIVE) {
          context.shouldLockInitialPosition = true;
          context.initialContentOffsetY = y;
        }

        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          if (isLockingScroll.value) {
            return;
          }

          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          isLockingScroll.value = true;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          isLockingScroll.value = false;
          scrollableContentOffsetY.value = lockPosition;
          _lockableScrollableContentOffsetY.value = lockPosition;
          return;
        }
        _lockableScrollableContentOffsetY.value = y;
      },
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedScrollableState,
        animatedSheetState,
        isLockingScroll,
      ]
    );
  const handleOnBeginDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
        scrollableContentOffsetY.value = y;
        _lockableScrollableContentOffsetY.value = y;
        rootScrollableContentOffsetY.value = y;
        context.initialContentOffsetY = y;

        /**
         * if sheet position not extended or fill parent and the scrollable position
         * not at the top, then we should lock the initial scrollable position.
         */
        if (
          animatedSheetState.value !== SHEET_STATE.EXTENDED &&
          animatedSheetState.value !== SHEET_STATE.FILL_PARENT &&
          y > 0
        ) {
          context.shouldLockInitialPosition = true;
        } else {
          context.shouldLockInitialPosition = false;
        }
      },
      [
        scrollableContentOffsetY,
        animatedSheetState,
        rootScrollableContentOffsetY,
      ]
    );
  const handleOnEndDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          if (isLockingScroll.value) {
            return;
          }

          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          isLockingScroll.value = true;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          isLockingScroll.value = false;
          scrollableContentOffsetY.value = lockPosition;
          _lockableScrollableContentOffsetY.value = lockPosition;
          return;
        }

        if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
          scrollableContentOffsetY.value = y;
          _lockableScrollableContentOffsetY.value = y;
          rootScrollableContentOffsetY.value = y;
        }
      },
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedAnimationState,
        animatedScrollableState,
        rootScrollableContentOffsetY,
        isLockingScroll,
      ]
    );
  const handleOnMomentumEnd: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          if (isLockingScroll.value) {
            return;
          }

          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          isLockingScroll.value = true;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
          isLockingScroll.value = false;
          scrollableContentOffsetY.value = 0;
          _lockableScrollableContentOffsetY.value = 0;
          return;
        }

        if (animatedAnimationState.value !== ANIMATION_STATE.RUNNING) {
          scrollableContentOffsetY.value = y;
          _lockableScrollableContentOffsetY.value = y;
          rootScrollableContentOffsetY.value = y;
        }
      },
      [
        scrollableContentOffsetY,
        scrollableRef,
        animatedAnimationState,
        animatedScrollableState,
        rootScrollableContentOffsetY,
        isLockingScroll,
      ]
    );
  //#endregion

  return {
    handleOnScroll,
    handleOnBeginDrag,
    handleOnEndDrag,
    handleOnMomentumEnd,
  };
};
