import { useSharedValue } from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../constants';

export const useScrollable = () => {
  // variables
  const animatedScrollableType = useSharedValue<SCROLLABLE_TYPE>(
    SCROLLABLE_TYPE.UNDETERMINED
  );
  const animatedScrollableContentOffsetY = useSharedValue<number>(0);
  const isScrollableRefreshable = useSharedValue<boolean>(false);

  return {
    animatedScrollableType,
    animatedScrollableContentOffsetY,
    isScrollableRefreshable,
  };
};
