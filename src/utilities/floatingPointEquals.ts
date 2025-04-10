const EPSILON = 0.1;

export function floatingPointEquals(valueA: number, valueB: number) {
  'worklet';
  return Math.abs(valueB - valueA) < EPSILON;
}
