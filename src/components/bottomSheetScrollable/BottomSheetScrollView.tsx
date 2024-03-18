import { memo } from 'react';
import Animated from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps,
} from './types';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);

const BottomSheetScrollView = memo(BottomSheetScrollViewComponent);
BottomSheetScrollView.displayName = 'BottomSheetScrollView';

export default BottomSheetScrollView as (
  props: BottomSheetScrollViewProps
) => ReturnType<typeof BottomSheetScrollView>;
