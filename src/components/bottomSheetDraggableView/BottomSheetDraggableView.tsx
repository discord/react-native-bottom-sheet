import React, { useMemo, memo } from 'react';
import Animated from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useBottomSheetGestureHandlers,
  useBottomSheetInternal,
} from '../../hooks';
import type { BottomSheetDraggableViewProps } from './types';
import { BottomSheetDraggableContext } from '../../contexts/gesture';

const BottomSheetDraggableViewComponent = ({
  refreshControlGestureRef,
  style,
  children,
  ...rest
}: BottomSheetDraggableViewProps) => {
  //#region hooks
  const {
    animatedScrollableRef,
    enableContentPanningGesture,
    simultaneousHandlers: _providedSimultaneousHandlers,
    waitFor,
    activeOffsetX,
    activeOffsetY,
    failOffsetX,
    failOffsetY,
  } = useBottomSheetInternal();
  const { contentPanGestureHandler } = useBottomSheetGestureHandlers();
  //#endregion

  //#region variables
  const simultaneousHandlers = useMemo(() => {
    const refs = [];

    if (refreshControlGestureRef) {
      refs.push(refreshControlGestureRef);
    }

    if (_providedSimultaneousHandlers) {
      if (Array.isArray(_providedSimultaneousHandlers)) {
        refs.push(..._providedSimultaneousHandlers);
      } else {
        refs.push(_providedSimultaneousHandlers);
      }
    }

    return refs;
  }, [
    _providedSimultaneousHandlers,
    animatedScrollableRef,
    refreshControlGestureRef,
  ]);
  const draggableGesture = useMemo(() => {
    let gesture = Gesture.Pan()
      .enabled(enableContentPanningGesture)
      .shouldCancelWhenOutside(false)
      .runOnJS(false)
      .onBegin(contentPanGestureHandler.handleOnBegin)
      .onStart(contentPanGestureHandler.handleOnStart)
      .onChange(contentPanGestureHandler.handleOnChange)
      .onUpdate(contentPanGestureHandler.handleOnUpdate)
      .onEnd(contentPanGestureHandler.handleOnEnd)
      .onFinalize(contentPanGestureHandler.handleOnFinalize);

    if (waitFor) {
      gesture = gesture.requireExternalGestureToFail(waitFor);
    }

    gesture = gesture.simultaneousWithExternalGesture(
      animatedScrollableRef,
      ...simultaneousHandlers
    );

    if (activeOffsetX) {
      gesture = gesture.activeOffsetX(activeOffsetX);
    }

    if (activeOffsetY) {
      gesture = gesture.activeOffsetY(activeOffsetY);
    }

    if (failOffsetX) {
      gesture = gesture.failOffsetX(failOffsetX);
    }

    if (failOffsetY) {
      gesture = gesture.failOffsetY(failOffsetY);
    }

    return gesture;
  }, [
    activeOffsetX,
    activeOffsetY,
    enableContentPanningGesture,
    failOffsetX,
    failOffsetY,
    simultaneousHandlers,
    waitFor,
    contentPanGestureHandler.handleOnChange,
    contentPanGestureHandler.handleOnEnd,
    contentPanGestureHandler.handleOnFinalize,
    contentPanGestureHandler.handleOnStart,
  ]);
  //#endregion

  return (
    <GestureDetector gesture={draggableGesture}>
      <BottomSheetDraggableContext.Provider value={draggableGesture}>
        <Animated.View style={style} {...rest}>
          {children}
        </Animated.View>
      </BottomSheetDraggableContext.Provider>
    </GestureDetector>
  );
};

const BottomSheetDraggableView = memo(BottomSheetDraggableViewComponent);
BottomSheetDraggableView.displayName = 'BottomSheetDraggableView';

export default BottomSheetDraggableView;
