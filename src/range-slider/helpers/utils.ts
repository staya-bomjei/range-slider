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

function valueToPercent(value: number, maxValue: number): number {
  return (value / maxValue) * 100;
}

function calcNewOptions<T extends Record<string, unknown>>(
  original: T,
  other: Partial<T>,
): Partial<T> {
  const newOptions: Partial<T> = {};
  const keys = Object.keys(other) as Array<keyof T>;

  keys.forEach((key) => {
    const isNewOption = original[key] !== other[key] && other[key] !== undefined;

    if (isNewOption) {
      newOptions[key] = other[key];
    }
  });

  return newOptions;
}

function callFunctionsForNewOptions<O extends Record<string, unknown>>(
  original: O | null,
  other: Partial<O>,
  callbacks: Array<{ dependencies: Array<keyof O>, callback: () => void}>,
): void {
  const newOptions = (original) ? calcNewOptions(original, other) : other;
  const keys = Object.keys(newOptions) as Array<keyof O>;

  callbacks.forEach(({ dependencies, callback }) => {
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

type Type = 'number' | 'boolean' | 'string[]' | 'orientation' | undefined;
function checkType(value: unknown, type: Type): boolean {
  switch (type) {
    case 'number':
    case 'boolean':
      return value !== undefined && typeof value === type;
    case 'string[]':
      return value !== undefined
        && Array.isArray(value)
        && value.every((item) => typeof item === 'string');
    case 'orientation':
      return value !== undefined
        && (value === 'vertical' || value === 'horizontal');
    default:
      throw new Error(`Unknown type '${type}'`);
  }
}

export {
  calcNearestStepValue,
  valueToPercent,
  calcNewOptions,
  callFunctionsForNewOptions,
  rectsIntersect,
  isFirstCloser,
  checkType,
};
