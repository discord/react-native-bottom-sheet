import type { PanGestureHandlerProperties } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetProps } from '../bottomSheet';
import type { BottomSheetHandleProps } from '../bottomSheetHandle';
import type { useInteractivePanGestureHandlerConfigs } from '../../hooks/useGestureHandler';

export interface BottomSheetHandleContainerProps
  extends Pick<PanGestureHandlerProperties, 'simultaneousHandlers'>,
    Pick<
      BottomSheetProps,
      | 'handleComponent'
      | 'enableHandlePanningGesture'
      | 'handleIndicatorStyle'
      | 'handleStyle'
    >,
    Pick<
      useInteractivePanGestureHandlerConfigs,
      | 'enableOverDrag'
      | 'enablePanDownToClose'
      | 'overDragResistanceFactor'
      | 'keyboardBehavior'
    >,
    BottomSheetHandleProps {
  handleHeight: SharedValue<number>;
}
