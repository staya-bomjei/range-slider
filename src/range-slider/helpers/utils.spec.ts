import { calcNearestStepValue } from './utils';

describe('calcNearestStepValue function:', () => {
  test('should return 10', () => {
    expect(calcNearestStepValue(11, 10)).toEqual(10);
  });
  test('should return 10', () => {
    expect(calcNearestStepValue(10, 10)).toEqual(10);
  });
  test('should return -10', () => {
    expect(calcNearestStepValue(-15, 10)).toEqual(-10);
  });
  test('should return 0.33', () => {
    expect(calcNearestStepValue(0.3, 0.33)).toEqual(0.33);
  });
  test('should return -44.5', () => {
    expect(calcNearestStepValue(-44.75, 0.5)).toEqual(-44.5);
  });
  test('should throw error', () => {
    expect(() => calcNearestStepValue(-44.75, -23)).toThrow();
  });
});
