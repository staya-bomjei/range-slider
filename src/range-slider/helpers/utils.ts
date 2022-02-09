function toFixed(number: number, fixedNumbers: number): number {
  return Number(number.toFixed(fixedNumbers));
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
  const minDifference = value - minCorrectValue;
  let maxCorrectValue = (Math.trunc(basedValue / step) + 1) * step + base;
  maxCorrectValue = toFixed(maxCorrectValue, fixedNumbers);
  const maxDifference = maxCorrectValue - value;

  return (minDifference < maxDifference) ? minCorrectValue : maxCorrectValue;
}

function valueToPercent(value: number, valueRange: number): number {
  return (value / valueRange) * 100;
}

function rectsIntersect(rect1: DOMRect, rect2: DOMRect): boolean {
  if (rect1.height === 0 && rect2.height === 0) return false;

  return rect1.left + rect1.width > rect2.left
  && rect1.right - rect1.width < rect2.right
  && rect1.top + rect1.height > rect2.top
  && rect1.bottom - rect1.height < rect2.bottom;
}

function isFirstCloser(position: number, first: number, second: number) {
  const firstRange = Math.abs(position - first);
  const secondRange = Math.abs(position - second);
  return firstRange < secondRange;
}

export {
  calcNearestStepValue,
  valueToPercent,
  rectsIntersect,
  isFirstCloser,
};
