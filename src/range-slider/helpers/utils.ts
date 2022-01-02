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

function isDifference<T extends Object>(first: T, second: T): boolean {
  const keys = Object.keys(first) as Array<keyof T>;

  return keys.some((key) => first[key] !== second[key]);
}

function hasAnyKey<T extends Object>(keys: Array<keyof T>, object: T): boolean {
  return keys.some((key) => key in object);
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

export {
  calcNearestStepValue,
  valueToPercent,
  calcDifference,
  isDifference,
  hasAnyKey,
  callFunctionsForNewOptions,
};
