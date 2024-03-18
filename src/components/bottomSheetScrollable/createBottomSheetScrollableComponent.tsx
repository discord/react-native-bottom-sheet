import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import {
  useAnimatedProps,
  useAnimatedStyle,
  isSharedValue,
} from 'react-native-reanimated';
import {
  useScrollHandler,
  useScrollableSetter,
  useBottomSheetInternal,
  useStableCallback,
} from '../../hooks';
import type { SCROLLABLE_TYPE } from '../../constants';
import { ScrollableContainer } from './ScrollableContainer';

export function createBottomSheetScrollableComponent<T, P>(
  type: SCROLLABLE_TYPE,
  ScrollableComponent: any
) {
  return forwardRef<T, P>((props, ref) => {
    // props
    const {
      // hooks
      focusHook,
      // props
      enableFooterMarginAdjustment = false,
      overScrollMode = 'never',
      keyboardDismissMode = 'interactive',
      showsVerticalScrollIndicator = true,
      style,
      refreshing,
      onRefresh,
      progressViewOffset,
      refreshControl,
      scrollEnabled: scrollEnabledProp,
      // events
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onContentSizeChange,
      ...rest
    }: any = props;

    //#region hooks
    const scrollHandler = useScrollHandler(
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag
    );
    const {
      animatedScrollableRef: scrollableRef,
      animatedFooterHeight,
      isScrollEnabled,
      enableDynamicSizing,
      animatedContentHeight,
      animatedScrollableContentOffsetY,
      isPanGestureMoving,
      isExpanded,
    } = useBottomSheetInternal();
    //#endregion

    //#region variables
    const scrollableAnimatedProps = useAnimatedProps(() => {
      const scrollEnabled =
        (isSharedValue(scrollEnabledProp)
          ? scrollEnabledProp.value
          : scrollEnabledProp) !== false;
      const showIndicator =
        (isSharedValue(showsVerticalScrollIndicator)
          ? showsVerticalScrollIndicator.value
          : showsVerticalScrollIndicator) !== false;
      return {
        scrollEnabled: scrollEnabled && isExpanded.value,
        // only bounce at bottom or not touching screen
        bounces:
          animatedScrollableContentOffsetY.value > 0 ||
          !isPanGestureMoving.value,
        showsVerticalScrollIndicator: showIndicator
          ? isExpanded.value && animatedScrollableContentOffsetY.value > 1
          : showIndicator,
      };
    }, [
      animatedScrollableContentOffsetY,
      isPanGestureMoving,
      showsVerticalScrollIndicator,
      isScrollEnabled,
      scrollEnabledProp,
    ]);
    //#endregion

    //#region callbacks
    const handleContentSizeChange = useStableCallback(
      (contentWidth: number, contentHeight: number) => {
        if (enableDynamicSizing) {
          animatedContentHeight.value =
            contentHeight +
            (enableFooterMarginAdjustment ? animatedFooterHeight.value : 0);
        }

        if (onContentSizeChange) {
          onContentSizeChange(contentWidth, contentHeight);
        }
      }
    );
    //#endregion

    //#region styles
    const containerAnimatedStyle = useAnimatedStyle(
      () => ({
        marginBottom: enableFooterMarginAdjustment
          ? animatedFooterHeight.value
          : 0,
      }),
      [enableFooterMarginAdjustment]
    );
    const containerStyle = useMemo(() => {
      return enableFooterMarginAdjustment
        ? [
            ...(style ? ('length' in style ? style : [style]) : []),
            containerAnimatedStyle,
          ]
        : style;
    }, [enableFooterMarginAdjustment, style, containerAnimatedStyle]);
    //#endregion

    //#region effects
    // @ts-ignore
    useImperativeHandle(ref, () => scrollableRef.current);
    useScrollableSetter(type, onRefresh !== undefined, focusHook);
    //#endregion

    //#region render
    return (
      <ScrollableContainer
        ref={scrollableRef}
        animatedProps={scrollableAnimatedProps}
        overScrollMode={overScrollMode}
        keyboardDismissMode={keyboardDismissMode}
        refreshing={refreshing}
        scrollEventThrottle={1}
        progressViewOffset={progressViewOffset}
        style={containerStyle}
        onRefresh={onRefresh}
        onScroll={scrollHandler}
        ScrollableComponent={ScrollableComponent}
        refreshControl={refreshControl}
        onContentSizeChange={handleContentSizeChange}
        {...rest}
      />
    );
    //#endregion
  });
}
