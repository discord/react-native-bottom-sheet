import React, { type ComponentProps, memo, useMemo } from 'react';
import { Platform } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useBottomSheetInternal } from '../../hooks';
import type { BottomSheetProps } from '../bottomSheet/types';
import { styles } from './styles';

export type BottomSheetBodyProps = {
  style?: BottomSheetProps['style'];
  children?: React.ReactNode;
  BodyComponent?: React.ComponentType<ComponentProps<typeof Animated.View>>;
};

function BottomSheetBodyComponent({
  style,
  children,
  BodyComponent = Animated.View,
}: BottomSheetBodyProps) {
  //#region hooks
  const { animatedIndex, animatedPosition } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: Platform.OS === 'android' && animatedIndex.get() === -1 ? 0 : 1,
      transform: [
        {
          translateY: animatedPosition.get(),
        },
      ],
    }),
    [animatedPosition, animatedIndex]
  );
  const containerStyle = useMemo(
    () => [style, styles.container, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );
  //#endregion

  return (
    <BodyComponent style={containerStyle} collapsable={true}>
      {children}
    </BodyComponent>
  );
}

export const BottomSheetBody = memo(BottomSheetBodyComponent);
BottomSheetBody.displayName = 'BottomSheetBody';
