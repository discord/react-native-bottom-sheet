import { runOnJS, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useScrollEventsHandlers } from './useScrollEventsHandlersDefault';
import { workletNoop as noop } from '../utilities';
import type { ScrollableEvent } from '../types';

export const useScrollHandler = (
  onScroll?: ScrollableEvent,
  onScrollBeginDrag?: ScrollableEvent,
  onScrollEndDrag?: ScrollableEvent
) => {
  // hooks
  const {
    handleOnScroll = noop,
    handleOnBeginDrag = noop,
    handleOnEndDrag = noop,
    handleOnMomentumEnd = noop,
    handleOnMomentumBegin = noop,
  } = useScrollEventsHandlers();

  // callbacks
  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event, context) => {
        handleOnScroll(event, context);

        if (onScroll) {
          runOnJS(onScroll)({ nativeEvent: event });
        }
      },
      onBeginDrag: (event, context) => {
        handleOnBeginDrag(event, context);

        if (onScrollBeginDrag) {
          runOnJS(onScrollBeginDrag)({ nativeEvent: event });
        }
      },
      onEndDrag: (event, context) => {
        handleOnEndDrag(event, context);

        if (onScrollEndDrag) {
          runOnJS(onScrollEndDrag)({ nativeEvent: event });
        }
      },
      onMomentumBegin: handleOnMomentumBegin,
      onMomentumEnd: handleOnMomentumEnd,
    },
    [
      handleOnScroll,
      handleOnBeginDrag,
      handleOnEndDrag,
      handleOnMomentumBegin,
      handleOnMomentumEnd,
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
    ]
  );

  return scrollHandler;
};
