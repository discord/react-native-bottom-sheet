import React, { type FC, forwardRef } from 'react';
import type { LegacySimultaneousGesture } from 'react-native-gesture-handler';
import { BottomSheetDraggableScrollable } from './BottomSheetDraggableScrollable';

interface ScrollableContainerProps {
  nativeGesture?: LegacySimultaneousGesture;
  // biome-ignore lint/suspicious/noExplicitAny: 🤷‍♂️
  ScrollableComponent: FC<any>;
}

export const ScrollableContainer = forwardRef<never, ScrollableContainerProps>(
  function ScrollableContainer(
    { nativeGesture, ScrollableComponent, ...rest },
    ref
  ) {
    return (
      <BottomSheetDraggableScrollable scrollableGesture={nativeGesture}>
        <ScrollableComponent ref={ref} {...rest} />
      </BottomSheetDraggableScrollable>
    );
  }
);
