import { createContext, Ref } from 'react';
import type { Insets } from 'react-native';
import type BottomSheet from '../../components/bottomSheet';
import type { SharedValue } from 'react-native-reanimated';
import type { BottomSheetModalStackBehavior } from '../../components/bottomSheetModal';

export interface BottomSheetModalInternalContextType {
  containerHeight: SharedValue<number>;
  containerOffset: SharedValue<Required<Insets>>;
  mountSheet: (
    key: string,
    ref: Ref<BottomSheet>,
    stackBehavior: BottomSheetModalStackBehavior
  ) => void;
  unmountSheet: (key: string) => void;
  willUnmountSheet: (key: string) => void;
}

export const BottomSheetModalInternalContext =
  createContext<BottomSheetModalInternalContextType | null>(null);

export const BottomSheetModalInternalProvider =
  BottomSheetModalInternalContext.Provider;
