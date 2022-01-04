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

function calcDifference<T extends Object>(first: T, second: Partial<T>): Partial<T> {
  const result: Partial<T> = {};
  const keys = Object.keys(second) as Array<keyof T>;

  keys.forEach((key) => {
    const isDifferentOption = first[key] !== second[key] && second[key] !== undefined;

    if (isDifferentOption) {
      result[key] = second[key];
    }
  });

  return result as T;
}

function callFunctionsForNewOptions<O extends Object>(
  originalOptions: O,
  options: Partial<O>,
  // Это объявление типа, поэтому переменная не используется
  // eslint-disable-next-line no-unused-vars
  properties: Array<{ dependencies: Array<keyof O>, callback: () => void}>,
): void {
  const newOptions = calcDifference(originalOptions, options);
  const keys = Object.keys(newOptions) as Array<keyof O>;

  properties.forEach(({ dependencies, callback }) => {
    const needToCall = dependencies.some((dependence) => (
      keys.some((key) => key === dependence)
    ));

    if (needToCall) callback();
  });
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
  calcDifference,
  callFunctionsForNewOptions,
  rectsIntersect,
  isFirstCloser,
};
