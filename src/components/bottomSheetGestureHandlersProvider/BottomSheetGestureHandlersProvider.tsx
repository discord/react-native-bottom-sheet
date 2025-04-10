import React, { useMemo } from 'react';
import { GESTURE_SOURCE } from '../../constants';
import {
  useGestureHandler,
  useBottomSheetInternal,
  useGestureEventsHandlers,
} from '../../hooks';
import { BottomSheetGestureHandlersContext } from '../../contexts';
import type { BottomSheetGestureHandlersProviderProps } from './types';
import { useSharedValue } from 'react-native-reanimated';

const BottomSheetGestureHandlersProvider = ({
  children,
}: BottomSheetGestureHandlersProviderProps) => {
  //#region variables
  const animatedGestureSource = useSharedValue<GESTURE_SOURCE>(
    GESTURE_SOURCE.UNDETERMINED
  );
  //#endregion

  //#region hooks
  const { animatedContentGestureState, animatedHandleGestureState } =
    useBottomSheetInternal();
  const {
    handleOnBegin,
    handleOnStart,
    handleOnChange,
    handleOnUpdate,
    handleOnEnd,
    handleOnFinalize,
  } = useGestureEventsHandlers();
  //#endregion

  //#region gestures
  const contentPanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.CONTENT,
    animatedContentGestureState,
    animatedGestureSource,
    handleOnBegin,
    handleOnStart,
    handleOnChange,
    handleOnUpdate,
    handleOnEnd,
    handleOnFinalize
  );

  const handlePanGestureHandler = useGestureHandler(
    GESTURE_SOURCE.HANDLE,
    animatedHandleGestureState,
    animatedGestureSource,
    handleOnBegin,
    handleOnStart,
    handleOnChange,
    handleOnUpdate,
    handleOnEnd,
    handleOnFinalize
  );
  //#endregion

  //#region context
  const contextValue = useMemo(
    () => ({
      contentPanGestureHandler,
      handlePanGestureHandler,
      animatedGestureSource,
    }),
    [contentPanGestureHandler, handlePanGestureHandler, animatedGestureSource]
  );
  //#endregion
  return (
    <BottomSheetGestureHandlersContext.Provider value={contextValue}>
      {children}
    </BottomSheetGestureHandlersContext.Provider>
  );
};

export default BottomSheetGestureHandlersProvider;
