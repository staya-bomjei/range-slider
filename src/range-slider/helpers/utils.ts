function calcNearestStepValue(value: number, step: number) {
  const minCorrectValue = Math.trunc(value / step) * step;
  const minDifference = value - minCorrectValue;
  const maxCorrectValue = (Math.trunc(value / step) + 1) * step;
  const maxDifference = maxCorrectValue - value;

  return (minDifference < maxDifference) ? minCorrectValue : maxCorrectValue;
}

function valueToPercent(value: number, maxValue: number) {
  return (value / maxValue) * 100;
}

function calcDifference<T extends Object>(first: T, second: Partial<T>): T {
  const result: Partial<T> = {};
  const keys = Object.keys(second) as Array<keyof T>;

  keys.forEach((key) => {
    if (first[key] !== second[key] && second[key] !== undefined) {
      result[key] = second[key];
    }
  });

  return result as T;
}

function hasAnyKey<T extends Object>(keys: Array<keyof T>, object: T): boolean {
  return keys.some((key) => key in object);
}

export {
  calcNearestStepValue,
  valueToPercent,
  calcDifference,
  hasAnyKey,
};
