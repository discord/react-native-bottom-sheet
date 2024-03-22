import React, { forwardRef } from 'react';
import BottomSheetRefreshControl from '../bottomSheetRefreshControl';
import { styles } from './styles';

interface ScrollableContainerProps {
  refreshControl: any;
  progressViewOffset: any;
  refreshing: any;
  onRefresh: any;
  ScrollableComponent: any;
}

export const ScrollableContainer = forwardRef<any, ScrollableContainerProps>(
  function ScrollableContainer(
    {
      refreshControl: _refreshControl,
      refreshing,
      progressViewOffset,
      onRefresh,
      ScrollableComponent,
      ...rest
    },
    ref
  ) {
    const Scrollable = <ScrollableComponent ref={ref} {...rest} />;

    return onRefresh ? (
      <BottomSheetRefreshControl
        refreshing={refreshing}
        progressViewOffset={progressViewOffset}
        onRefresh={onRefresh}
        style={styles.container}
      >
        {Scrollable}
      </BottomSheetRefreshControl>
    ) : (
      Scrollable
    );
  }
);
