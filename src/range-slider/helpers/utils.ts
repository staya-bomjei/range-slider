import { StateDependencies } from './types';

function toFixed(number: number, fixedNumbers: number): number {
  return Number(number.toFixed(fixedNumbers));
}

function isFirstCloser(position: number, first: number, second: number) {
  const firstRange = Math.abs(position - first);
  const secondRange = Math.abs(position - second);
  return firstRange < secondRange;
}

function calcNearestStepValue(
  value: number,
  step: number,
  base: number,
  fixedNumbers = 12,
): number {
  if (step < 0) {
    throw new Error('Step can\'t be less than zero');
  }

  const basedValue = value - base;
  if (basedValue % step === 0) return value;

  let minCorrectValue = Math.trunc(basedValue / step) * step + base;
  minCorrectValue = toFixed(minCorrectValue, fixedNumbers);
  let maxCorrectValue = (Math.trunc(basedValue / step) + 1) * step + base;
  maxCorrectValue = toFixed(maxCorrectValue, fixedNumbers);

  const isMin = isFirstCloser(value, minCorrectValue, maxCorrectValue);
  return (isMin) ? minCorrectValue : maxCorrectValue;
}

function calcStepValues(min: number, max: number, step: number, parts: number): Array<number> {
  const valuePerPart = (max - min) / parts;
  let prevValue: number;

  const stepValues = [...new Array(parts + 1)].map((_, index) => {
    const value = valuePerPart * index + min;
    let nearestCorrectValue = calcNearestStepValue(value, step, min);

    if (nearestCorrectValue === prevValue) nearestCorrectValue += step;
    prevValue = nearestCorrectValue;

    return nearestCorrectValue;
  });

  stepValues[stepValues.length - 1] = max;

  return stepValues;
}

function rectsIntersect(rect1: DOMRect, rect2: DOMRect): boolean {
  return rect1.left + rect1.width > rect2.left
  && rect1.right - rect1.width < rect2.right
  && rect1.top + rect1.height > rect2.top
  && rect1.bottom - rect1.height < rect2.bottom;
}

function valueToPercent(value: number, valueRange: number): number {
  return (value / valueRange) * 100;
}

function percentToValue(percent: number, min: number, max: number): number {
  return (percent * (max - min)) / 100 + min;
}

function getChangedOptions<T extends Record<string, unknown>>(
  options: T,
  newOptions: Partial<T>,
): Partial<T> {
  return Object.keys(newOptions)
    .filter((key) => options[key] !== newOptions[key])
    .reduce((result, key) => ({ ...result, [key]: newOptions[key] }), {});
}

function updateState<T extends Record<string, unknown>>(
  options: Partial<T>,
  state: StateDependencies<T>,
): void {
  state.forEach(({ dependencies, setState }) => {
    const needToCall = dependencies.some((dependence) => dependence in options);
    if (needToCall) setState();
  });
}

export {
  isFirstCloser,
  calcNearestStepValue,
  calcStepValues,
  rectsIntersect,
  valueToPercent,
  percentToValue,
  getChangedOptions,
  updateState,
};
