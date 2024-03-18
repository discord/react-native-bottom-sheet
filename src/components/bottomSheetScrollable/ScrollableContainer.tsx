import React, { forwardRef } from 'react';

interface ScrollableContainerProps {
  ScrollableComponent: any;
}

export const ScrollableContainer = forwardRef<any, ScrollableContainerProps>(
  function ScrollableContainer({ ScrollableComponent, ...rest }, ref) {
    return <ScrollableComponent ref={ref} {...rest} />;
  }
);
