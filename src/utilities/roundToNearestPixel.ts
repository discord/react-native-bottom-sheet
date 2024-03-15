import { PixelRatio } from 'react-native';

const PIXEL_DENSITY = PixelRatio.get();

export function roundToNearestPixel(position: number) {
  'worklet';
  return Math.round(position * PIXEL_DENSITY) / PIXEL_DENSITY;
}
