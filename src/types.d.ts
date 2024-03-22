import type {
  FlatList,
  ScrollView,
  SectionList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  AccessibilityProps,
} from 'react-native';
import type {
  GestureEventPayload,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import type Animated from 'react-native-reanimated';
import type {
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import type { FlashList } from '@shopify/flash-list';
import type { GESTURE_SOURCE } from './constants';

//#region Methods
export interface BottomSheetMethods {
  /**
   * Snap to one of the provided points from `snapPoints`.
   * @param index snap point index.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  snapToIndex: (
    index: number,
    animationConfigs?: WithSpringConfig | WithTimingConfig
  ) => void;
  /**
   * Snap to a position out of provided  `snapPoints`.
   * @param position position in pixel or percentage.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  snapToPosition: (
    position: number | string,
    animationConfigs?: WithSpringConfig | WithTimingConfig
  ) => void;
  /**
   * Snap to the maximum provided point from `snapPoints`.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  expand: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
  /**
   * Snap to the minimum provided point from `snapPoints`.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  collapse: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
  /**
   * Close the bottom sheet.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  close: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
  /**
   * Force close the bottom sheet, this prevent any interruptions till the sheet is closed.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  forceClose: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
}
export interface BottomSheetModalMethods extends BottomSheetMethods {
  /**
   * Mount and present the bottom sheet modal to the initial snap point.
   * @param data to be passed to the modal.
   */
  present: (data?: any) => void;
  /**
   * Close and unmount the bottom sheet modal.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  dismiss: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void;
}
//#endregion

export interface BottomSheetVariables {
  /**
   * Current sheet position index.
   * @type SharedValue<number>
   */
  animatedIndex: SharedValue<number>;
  /**
   * Current sheet position.
   * @type SharedValue<number>
   */
  animatedPosition: SharedValue<number>;
}

//#region scrollables
export type Scrollable = FlashList | FlatList | ScrollView | SectionList;
export type ScrollableEvent = (
  event: Pick<NativeSyntheticEvent<NativeScrollEvent>, 'nativeEvent'>
) => void;
//#endregion

//#region utils
export type Primitive = string | number | boolean;
export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
//#endregion

//#region hooks
export type GestureEventHandlerCallbackType = (
  source: GESTURE_SOURCE,
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
) => void;

export type GestureEventsHandlersHookType = () => {
  handleOnBegin: GestureEventHandlerCallbackType;
  handleOnStart: GestureEventHandlerCallbackType;
  handleOnChange: GestureEventHandlerCallbackType;
  handleOnUpdate: GestureEventHandlerCallbackType;
  handleOnEnd: GestureEventHandlerCallbackType;
  handleOnFinalize: GestureEventHandlerCallbackType;
};

export type GestureHandlersHookType = (
  source: GESTURE_SOURCE,
  state: Animated.SharedValue<State>,
  gestureSource: Animated.SharedValue<GESTURE_SOURCE>,
  onBegin: GestureEventHandlerCallbackType,
  onStart: GestureEventHandlerCallbackType,
  onChange: GestureEventHandlerCallbackType,
  onUpdate: GestureEventHandlerCallbackType,
  onEnd: GestureEventHandlerCallbackType,
  onFinalize: GestureEventHandlerCallbackType
) => {
  handleOnBegin: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  handleOnStart: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  handleOnChange: (
    event: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >
  ) => void;
  handleOnUpdate: (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => void;
  handleOnEnd: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
  handleOnFinalize: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => void;
};

type ScrollEventHandlerCallbackType<C = any> = (
  payload: NativeScrollEvent,
  context: C
) => void;

export type ScrollEventsHandlersHookType = () => {
  handleOnScroll?: ScrollEventHandlerCallbackType;
  handleOnBeginDrag?: ScrollEventHandlerCallbackType;
  handleOnEndDrag?: ScrollEventHandlerCallbackType;
  handleOnMomentumBegin?: ScrollEventHandlerCallbackType;
  handleOnMomentumEnd?: ScrollEventHandlerCallbackType;
};
//#endregion

export interface NullableAccessibilityProps extends AccessibilityProps {
  accessible?: AccessibilityProps['accessible'] | null;
  accessibilityLabel?: AccessibilityProps['accessibilityLabel'] | null;
  accessibilityHint?: AccessibilityProps['accessibilityHint'] | null;
  accessibilityRole?: AccessibilityProps['accessibilityRole'] | null;
}
