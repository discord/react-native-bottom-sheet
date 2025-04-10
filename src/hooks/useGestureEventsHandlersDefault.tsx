import { Keyboard, Platform } from 'react-native';
import {
  runOnJS,
  scrollTo,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';
import { useBottomSheetInternal } from './useBottomSheetInternal';
import {
  ANIMATION_SOURCE,
  GESTURE_SOURCE,
  KEYBOARD_STATE,
  SCROLLABLE_TYPE,
  WINDOW_HEIGHT,
} from '../constants';
import type {
  GestureEventsHandlersHookType,
  GestureEventHandlerCallbackType,
} from '../types';
import { clamp } from '../utilities/clamp';
import { snapPoint } from '../utilities/snapPoint';
import { floatingPointEquals } from '../utilities';

type GestureEventContextType = {
  initialPosition: number;
  initialKeyboardState: KEYBOARD_STATE;
};

const INITIAL_CONTEXT: GestureEventContextType = {
  initialPosition: 0,
  initialKeyboardState: KEYBOARD_STATE.UNDETERMINED,
};

const dismissKeyboard = Keyboard.dismiss;

const resetContext = (context: any) => {
  'worklet';

  Object.keys(context).map(key => {
    context[key] = undefined;
  });
};

export const useGestureEventsHandlers: GestureEventsHandlersHookType = () => {
  //#region variables
  const {
    animatedPosition,
    animatedSnapPoints,
    animatedKeyboardState,
    animatedKeyboardHeight,
    animatedContainerHeight,
    animatedScrollableType,
    animatedHighestSnapPoint,
    animatedClosedPosition,
    animatedScrollableContentOffsetY,
    animatedScrollableRef,
    enableOverDrag,
    enablePanDownToClose,
    overDragResistanceFactor,
    isInTemporaryPosition,
    isScrollableRefreshable,
    isPanGestureMoving,
    panGestureMovedY,
    isScrollEnabled,
    isScrollHandled,
    isExpanded,
    animateToPosition,
    stopAnimation,
  } = useBottomSheetInternal();

  const context = useSharedValue<GestureEventContextType>({
    ...INITIAL_CONTEXT,
  });
  //#endregion

  //#region gesture methods
  const handleOnBegin: GestureEventHandlerCallbackType = useWorkletCallback(
    function handleOnBegin(__, _) {
      // touching screen
      isPanGestureMoving.value = true;
    },
    [isPanGestureMoving]
  );
  const handleOnStart: GestureEventHandlerCallbackType = useWorkletCallback(
    function handleOnStart(__, _) {
      // cancel current animation
      stopAnimation();

      // store current animated position
      context.value = {
        ...context.value,
        initialPosition: animatedPosition.value,
        initialKeyboardState: animatedKeyboardState.value,
      };
    },
    [
      stopAnimation,
      animatedPosition,
      animatedKeyboardState,
      animatedScrollableContentOffsetY,
    ]
  );
  const handleOnChange: GestureEventHandlerCallbackType = useWorkletCallback(
    function handleOnChange(source, { translationY }) {
      let highestSnapPoint = animatedHighestSnapPoint.value;

      /**
       * if keyboard is shown, then we set the highest point to the current
       * position which includes the keyboard height.
       */
      if (
        isInTemporaryPosition.value &&
        context.value.initialKeyboardState === KEYBOARD_STATE.SHOWN
      ) {
        highestSnapPoint = context.value.initialPosition;
      }

      /**
       * if current position is out of provided `snapPoints` and smaller then
       * highest snap pont, then we set the highest point to the current position.
       */
      if (
        isInTemporaryPosition.value &&
        context.value.initialPosition < highestSnapPoint
      ) {
        highestSnapPoint = context.value.initialPosition;
      }

      const lowestSnapPoint = enablePanDownToClose
        ? animatedContainerHeight.value
        : animatedSnapPoints.value[0];

      /**
       * if scrollable is refreshable and sheet position at the highest
       * point, then do not interact with current gesture.
       */
      if (
        source === GESTURE_SOURCE.CONTENT &&
        isScrollableRefreshable.value &&
        floatingPointEquals(animatedPosition.value, highestSnapPoint)
      ) {
        return;
      }

      /**
       * an accumulated value of starting position with gesture translation y.
       */
      let draggedPosition = context.value.initialPosition + translationY;

      // move sheet if top of scrollview or is closed state
      if (
        floatingPointEquals(animatedScrollableContentOffsetY.value, 0) ||
        !isExpanded.value
      ) {
        draggedPosition = draggedPosition - panGestureMovedY.value;
      } else {
        // capture movement, but don't move sheet
        panGestureMovedY.value = translationY;
      }

      // simulate scroll if user continues touching screen
      if (
        !floatingPointEquals(context.value.initialPosition, highestSnapPoint) &&
        draggedPosition < highestSnapPoint
      ) {
        scrollTo(
          animatedScrollableRef,
          0,
          -draggedPosition + highestSnapPoint,
          false /* animated */
        );
      }

      /**
       * a clamped value of the accumulated dragged position, to insure keeping the dragged
       * position between the highest and lowest snap points.
       */
      const clampedPosition = clamp(
        draggedPosition,
        highestSnapPoint,
        lowestSnapPoint
      );

      /**
       * over-drag implementation.
       */
      if (enableOverDrag) {
        if (
          (source === GESTURE_SOURCE.HANDLE ||
            animatedScrollableType.value === SCROLLABLE_TYPE.VIEW) &&
          draggedPosition < highestSnapPoint
        ) {
          const resistedPosition =
            highestSnapPoint -
            Math.sqrt(1 + (highestSnapPoint - draggedPosition)) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (
          source === GESTURE_SOURCE.HANDLE &&
          draggedPosition > lowestSnapPoint
        ) {
          const resistedPosition =
            lowestSnapPoint +
            Math.sqrt(1 + (draggedPosition - lowestSnapPoint)) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }

        if (
          source === GESTURE_SOURCE.CONTENT &&
          draggedPosition > lowestSnapPoint
        ) {
          const resistedPosition =
            lowestSnapPoint +
            Math.sqrt(1 + (draggedPosition - lowestSnapPoint)) *
              overDragResistanceFactor;
          animatedPosition.value = resistedPosition;
          return;
        }
      }

      animatedPosition.value = clampedPosition;
    },
    [
      enableOverDrag,
      enablePanDownToClose,
      overDragResistanceFactor,
      isInTemporaryPosition,
      isScrollableRefreshable,
      animatedHighestSnapPoint,
      animatedContainerHeight,
      animatedSnapPoints,
      animatedPosition,
      animatedScrollableType,
      animatedScrollableContentOffsetY,
      isScrollEnabled,
      isScrollHandled,
    ]
  );
  const handleOnUpdate: GestureEventHandlerCallbackType = useWorkletCallback(
    function handleOnUpdate(__, _) {},
    []
  );
  const handleOnEnd: GestureEventHandlerCallbackType = useWorkletCallback(
    function handleOnEnd(source, { translationY, absoluteY, velocityY }) {
      const highestSnapPoint = animatedHighestSnapPoint.value;
      const isSheetAtHighestSnapPoint = floatingPointEquals(
        animatedPosition.value,
        highestSnapPoint
      );

      /**
       * if scrollable is refreshable and sheet position at the highest
       * point, then do not interact with current gesture.
       */
      if (
        source === GESTURE_SOURCE.CONTENT &&
        isScrollableRefreshable.value &&
        isSheetAtHighestSnapPoint
      ) {
        return;
      }

      /**
       * if the sheet is in a temporary position and the gesture ended above
       * the current position, then we snap back to the temporary position.
       */
      if (
        isInTemporaryPosition.value &&
        context.value.initialPosition >= animatedPosition.value
      ) {
        if (context.value.initialPosition > animatedPosition.value) {
          animateToPosition(
            context.value.initialPosition,
            ANIMATION_SOURCE.GESTURE,
            velocityY / 2
          );
        }
        return;
      }

      /**
       * close keyboard if current position is below the recorded
       * start position and keyboard still shown.
       */
      const isScrollable =
        animatedScrollableType.value !== SCROLLABLE_TYPE.UNDETERMINED &&
        animatedScrollableType.value !== SCROLLABLE_TYPE.VIEW;

      /**
       * if keyboard is shown and the sheet is dragged down,
       * then we dismiss the keyboard.
       */
      if (
        context.value.initialKeyboardState === KEYBOARD_STATE.SHOWN &&
        animatedPosition.value > context.value.initialPosition
      ) {
        /**
         * if the platform is ios, current content is scrollable and
         * the end touch point is below the keyboard position then
         * we exit the method.
         *
         * because the the keyboard dismiss is interactive in iOS.
         */
        if (
          !(
            Platform.OS === 'ios' &&
            isScrollable &&
            absoluteY > WINDOW_HEIGHT - animatedKeyboardHeight.value
          )
        ) {
          runOnJS(dismissKeyboard)();
        }
      }

      /**
       * reset isInTemporaryPosition value
       */
      if (isInTemporaryPosition.value) {
        isInTemporaryPosition.value = false;
      }

      /**
       * clone snap points array, and insert the container height
       * if pan down to close is enabled.
       */
      const snapPoints = animatedSnapPoints.value.slice();
      if (enablePanDownToClose) {
        snapPoints.unshift(animatedClosedPosition.value);
      }

      /**
       * calculate the destination point, using redash.
       */
      const destinationPoint = snapPoint(
        translationY + context.value.initialPosition,
        velocityY,
        snapPoints
      );

      /**
       * if destination point is the same as the current position,
       * then no need to perform animation.
       */
      if (floatingPointEquals(destinationPoint, animatedPosition.value)) {
        return;
      }

      const wasGestureHandledByScrollView =
        source === GESTURE_SOURCE.CONTENT &&
        animatedScrollableContentOffsetY.value > 0;
      /**
       * prevents snapping from top to middle / bottom with repeated interrupted scrolls
       */
      if (wasGestureHandledByScrollView && isSheetAtHighestSnapPoint) {
        return;
      }

      animateToPosition(
        destinationPoint,
        ANIMATION_SOURCE.GESTURE,
        velocityY / 2
      );
    },
    [
      enablePanDownToClose,
      isInTemporaryPosition,
      isScrollableRefreshable,
      animatedClosedPosition,
      animatedHighestSnapPoint,
      animatedKeyboardHeight,
      animatedPosition,
      animatedScrollableType,
      animatedSnapPoints,
      animatedScrollableContentOffsetY,
      animateToPosition,
      isScrollEnabled,
    ]
  );

  const handleOnFinalize: GestureEventHandlerCallbackType = useWorkletCallback(
    function handleOnFinalize() {
      resetContext(context);
      isPanGestureMoving.value = false;
      panGestureMovedY.value = 0;
    },
    [context, isPanGestureMoving, panGestureMovedY]
  );
  //#endregion

  return {
    handleOnBegin,
    handleOnStart,
    handleOnChange,
    handleOnUpdate,
    handleOnEnd,
    handleOnFinalize,
  };
};
