import { memo } from 'react';
import { AnimatedFlashList } from '@discordapp/flash-list';
import { SCROLLABLE_TYPE } from '../../constants';
import { createBottomSheetScrollableComponent } from './createBottomSheetScrollableComponent';
import type {
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps,
} from './types';

const BottomSheetFlashListComponent = createBottomSheetScrollableComponent<
  BottomSheetFlashListMethods,
  BottomSheetFlashListProps<any>
>(SCROLLABLE_TYPE.FLASHLIST, AnimatedFlashList);

const BottomSheetFlashList = memo(BottomSheetFlashListComponent);
BottomSheetFlashList.displayName = 'BottomSheetFlashList';

export default BottomSheetFlashList as <T>(
  props: BottomSheetFlashListProps<T>
) => ReturnType<typeof BottomSheetFlashList>;
