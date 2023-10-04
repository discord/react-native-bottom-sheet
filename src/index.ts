// bottom sheet
export { default } from './components/bottomSheet';

// bottom sheet modal
export { default as BottomSheetModal } from './components/bottomSheetModal';
export { default as BottomSheetModalProvider } from './components/bottomSheetModalProvider';

//#region hooks
export { useBottomSheet } from './hooks/useBottomSheet';
export { useBottomSheetModal } from './hooks/useBottomSheetModal';
export { useBottomSheetSpringConfigs } from './hooks/useBottomSheetSpringConfigs';
export { useBottomSheetTimingConfigs } from './hooks/useBottomSheetTimingConfigs';
export { useBottomSheetInternal } from './hooks/useBottomSheetInternal';
export { useBottomSheetModalInternal } from './hooks/useBottomSheetModalInternal';
export { useScrollEventsHandlersDefault } from './hooks/useScrollEventsHandlersDefault';
export { useGestureEventsHandlersDefault } from './hooks/useGestureEventsHandlersDefault';
export { useBottomSheetGestureHandlers } from './hooks/useBottomSheetGestureHandlers';
export { useScrollHandler } from './hooks/useScrollHandler';
export { useScrollableSetter } from './hooks/useScrollableSetter';
//#endregion

//#region components
export {
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetFlatList,
  BottomSheetVirtualizedList,
  BottomSheetFlashList,
} from './components/bottomSheetScrollable';
export { default as BottomSheetHandle } from './components/bottomSheetHandle';
export { default as BottomSheetDraggableView } from './components/bottomSheetDraggableView';
export { default as BottomSheetView } from './components/bottomSheetView';
export { default as BottomSheetTextInput } from './components/bottomSheetTextInput';
export { default as BottomSheetBackdrop } from './components/bottomSheetBackdrop';
export { default as BottomSheetFooter } from './components/bottomSheetFooter';
export { default as BottomSheetFooterContainer } from './components/bottomSheetFooterContainer/BottomSheetFooterContainer';

// touchables
import BottomSheetTouchable from './components/touchables';
export const {
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} = BottomSheetTouchable;
// utils
export { createBottomSheetScrollableComponent } from './components/bottomSheetScrollable';
//#endregion

//#region types
export type { BottomSheetProps } from './components/bottomSheet';
export type { BottomSheetModalProps } from './components/bottomSheetModal';
export type { BottomSheetHandleProps } from './components/bottomSheetHandle';
export type { BottomSheetBackgroundProps } from './components/bottomSheetBackground';
export type { BottomSheetBackdropProps } from './components/bottomSheetBackdrop';
export type { BottomSheetFooterProps } from './components/bottomSheetFooter';

export type {
  BottomSheetFlatListMethods,
  BottomSheetScrollViewMethods,
  BottomSheetSectionListMethods,
  BottomSheetVirtualizedListMethods,
  BottomSheetScrollableProps,
} from './components/bottomSheetScrollable';

export type {
  ScrollEventsHandlersHookType,
  GestureEventsHandlersHookType,
  ScrollEventHandlerCallbackType,
  GestureEventHandlerCallbackType,
} from './types';
//#endregion

//#region utilities
export * from './constants';
export { getKeyboardAnimationConfigs } from './utilities';
export { enableLogging } from './utilities/logger';
//#endregion
