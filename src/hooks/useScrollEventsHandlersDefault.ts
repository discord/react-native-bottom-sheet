import { State } from 'react-native-gesture-handler';
import { scrollTo, useAnimatedReaction, useSharedValue, useWorkletCallback } from 'react-native-reanimated';
import { ANIMATION_STATE, SCROLLABLE_STATE, SHEET_STATE } from '../constants';
import type {
  ScrollEventHandlerCallbackType,
  ScrollEventsHandlersHookType,
} from '../types';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import { Platform } from 'react-native';

export type ScrollEventContextType = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

export const useScrollEventsHandlersDefault: ScrollEventsHandlersHookType = (
  scrollableRef,
  scrollableContentOffsetY,
  scrollBuffer,
  preserveScrollMomentum,
  lockableScrollableContentOffsetY,
) => {
  // hooks
  const {
    animatedSheetState,
    animatedScrollableState,
    animatedAnimationState,
    animatedHandleGestureState,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY,
    isScrollableLocked,
    isScrollEnded,
  } = useBottomSheetInternal();
  const awaitingFirstScroll = useSharedValue(false);
  const _lockableScrollableContentOffsetY = useSharedValue(0);

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
         * When a scrollBuffer is provided, we take locking the scrollable into our own hands.
         * We need to do this because it's not possible to know the direction of the scroll during
         * handleOnBeginDrag, and the scrollable shouldn't be locked when scrolling back to the
         * start of the list.
         */
        if ((preserveScrollMomentum || scrollBuffer) && awaitingFirstScroll.value && !isScrollableLocked.value) {
          const isScrollingTowardsBottom = context.initialContentOffsetY < y;
          if (isScrollingTowardsBottom && y > (scrollBuffer ?? 0) && context.shouldLockInitialPosition) {
            isScrollableLocked.value = true;
            animatedScrollableState.value = SCROLLABLE_STATE.LOCKED;
          } else if (!isScrollingTowardsBottom && preserveScrollMomentum && y <= 0 && context.shouldLockInitialPosition) {
            isScrollableLocked.value = true;
            animatedScrollableState.value = SCROLLABLE_STATE.LOCKED;
          }
          awaitingFirstScroll.value = false;
        }

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
          if (!(preserveScrollMomentum && isScrollEnded.value)) {
            const lockPosition = context.shouldLockInitialPosition
              ? context.initialContentOffsetY ?? 0
              : 0;
            // @ts-ignore
            scrollTo(scrollableRef, 0, lockPosition, false);
            scrollableContentOffsetY.value = lockPosition;
            _lockableScrollableContentOffsetY.value = lockPosition;
          }
          return;
        }
        _lockableScrollableContentOffsetY.value = y;
      },
      [
        scrollableRef,
        scrollableContentOffsetY,
        animatedScrollableState,
        animatedSheetState,
      ]
    );
  const handleOnBeginDrag: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      (event, context) => {
        const y = event.contentOffset.y;
        scrollableContentOffsetY.value = y;
        _lockableScrollableContentOffsetY.value = y;
        rootScrollableContentOffsetY.value = y;
        context.initialContentOffsetY = y;
        awaitingFirstScroll.value = true;
        isScrollEnded.value = false;

        if (scrollBuffer) {
          if (y <= 0 && (
            animatedSheetState.value === SHEET_STATE.EXTENDED ||
            animatedSheetState.value === SHEET_STATE.FILL_PARENT
          )) {
            isScrollableLocked.value = true;
          } else {
            isScrollableLocked.value = false;
          }
        } else if (preserveScrollMomentum) {
          if (Platform.OS === 'ios') {
            isScrollableLocked.value = false;
          } else {
            // On Android, there is no overscroll, so the handleOnScroll
            // callback never fires when dragging down from the top. In those cases,
            // we just want to lock the scrollable immediately so that it can
            // pan downward as expected.
            isScrollableLocked.value = y <= 0;
          }
        } else {
          isScrollableLocked.value = true;
        }

        /**
         * if sheet position not extended or fill parent and the scrollable position
         * not at the top, then we should lock the initial scrollable position.
         */
        if (
          (animatedSheetState.value !== SHEET_STATE.EXTENDED &&
          animatedSheetState.value !== SHEET_STATE.FILL_PARENT &&
          y > 0) || (preserveScrollMomentum && y <= 0)
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
      ({ contentOffset: { y }}, context) => {
        awaitingFirstScroll.value = false;
        isScrollEnded.value = true;
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          const lockPosition = context.shouldLockInitialPosition
            ? (context.initialContentOffsetY ?? 0)
            : 0;
          // @ts-ignore
          scrollTo(scrollableRef, 0, lockPosition, false);
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
      ]
    );
  const handleOnMomentumEnd: ScrollEventHandlerCallbackType<ScrollEventContextType> =
    useWorkletCallback(
      ({ contentOffset: { y } }, context) => {
        if (animatedScrollableState.value === SCROLLABLE_STATE.LOCKED) {
          if (!(preserveScrollMomentum && isScrollEnded.value)) {
            const lockPosition = context.shouldLockInitialPosition
              ? context.initialContentOffsetY ?? 0
              : 0;
            // @ts-ignore
            scrollTo(scrollableRef, 0, lockPosition, false);
            scrollableContentOffsetY.value = 0;
            _lockableScrollableContentOffsetY.value = 0;
          }
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
