import { StateDependencies } from './types';
import {
  isFirstCloser,
  calcNearestStepValue,
  rectsIntersect,
  valueToPercent,
  percentToValue,
  getChangedOptions,
  updateState,
} from './utils';

describe('isFirstCloser function:', () => {
  test('should return true', () => {
    expect(isFirstCloser(10, 9, 12)).toEqual(true);
  });
  test('should return false', () => {
    expect(isFirstCloser(-1003, 0, 0)).toEqual(false);
  });
  test('should return true', () => {
    expect(isFirstCloser(0.0001, 0.00002, 0.00001)).toEqual(true);
  });
});

describe('calcNearestStepValue function:', () => {
  test('should return 10', () => {
    expect(calcNearestStepValue(11, 10, 0)).toEqual(10);
  });
  test('should return 9', () => {
    expect(calcNearestStepValue(9, 9, 9)).toEqual(9);
  });
  test('should return 9', () => {
    expect(calcNearestStepValue(9, 199, 9)).toEqual(9);
  });
  test('should return -10', () => {
    expect(calcNearestStepValue(-15, 10, 0)).toEqual(-10);
  });
  test('should return -8', () => {
    expect(calcNearestStepValue(-15, 10, 2)).toEqual(-8);
  });
  test('should return 0.33', () => {
    expect(calcNearestStepValue(0.3, 0.33, -0.33)).toEqual(0.33);
  });
  test('should return 0.3', () => {
    expect(calcNearestStepValue(0.3, 0.33, -0.33, 1)).toEqual(0.3);
  });
  test('should return 0.3', () => {
    expect(calcNearestStepValue(0.3, 0.35, 0, 1)).toEqual(0.3);
  });
  test('should return -44.5', () => {
    expect(calcNearestStepValue(-44.75, 0.5, 122)).toEqual(-44.5);
  });
  test('should throw error', () => {
    expect(() => calcNearestStepValue(-44.75, -23, 0)).toThrow();
  });
});

describe('rectsIntersect function:', () => {
  // Вообще тут стоило бы использовать new DOMRect(...), но по какой-то
  // причине jest выбрасывает в меня это: ReferenceError: DOMRect is not defined
  const createRect = (x: number, y: number, width: number, height: number) => ({
    x,
    y,
    width,
    height,
    left: (width > 0) ? x : x + width,
    right: (width > 0) ? x + width : x,
    top: (height > 0) ? y : y + height,
    bottom: (height > 0) ? y + height : y,
    toJSON: () => null,
  });
  const first: DOMRect = createRect(0, 0, 100, 100);

  test('should return true', () => {
    const second = createRect(99, 0, 100, 100);
    expect(rectsIntersect(first, second)).toEqual(true);
  });

  test('should return false', () => {
    const second = createRect(100, 0, 100, 100);
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return true', () => {
    const second = createRect(0, 99, 100, 100);
    expect(rectsIntersect(first, second)).toEqual(true);
  });

  test('should return false', () => {
    const second = createRect(0, 100, 100, 100);
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return false', () => {
    const second = createRect(0, 0, 100, 0);
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return false', () => {
    const second = createRect(0, 0, 100, 0);
    const third = createRect(0, 0, 100, 0);
    expect(rectsIntersect(third, second)).toEqual(false);
  });
});

describe('valueToPercent function:', () => {
  test('should return 10', () => {
    expect(valueToPercent(10, 100)).toEqual(10);
  });
  test('should return 30', () => {
    expect(valueToPercent(0.3, 1)).toEqual(30);
  });
  test('should Infinity', () => {
    expect(valueToPercent(20, 0)).toEqual(Infinity);
  });
});

describe('percentToValue function:', () => {
  test('should return 10', () => {
    expect(percentToValue(10, 0, 100)).toEqual(10);
  });
  test('should return 1030', () => {
    expect(percentToValue(3, 1000, 2000)).toEqual(1030);
  });
});

describe('getChangedOptions function:', () => {
  const options = {
    option1: 'option1',
    option2: 2,
    option3: false,
  };

  test('should return empty object', () => {
    const newOptions = {};
    const changedOptions = getChangedOptions(options, newOptions);

    expect(changedOptions).toMatchObject({});
  });

  test('should return all new options', () => {
    const newOptions = {
      option1: 'o1',
      option2: 3,
    };
    const changedOptions = getChangedOptions(options, newOptions);

    expect(changedOptions).toMatchObject(newOptions);
  });

  test('should return some new options', () => {
    const newOptions = {
      option1: 'o1',
      option2: 3,
      option3: false,
    };
    const changedOptions = getChangedOptions(options, newOptions);

    expect(changedOptions).toMatchObject({
      option1: 'o1',
      option2: 3,
    });
  });
});

describe('updateState function:', () => {
  type Options = {
    option1: string,
    option2: number,
    option3: boolean,
  };
  const setOption1 = jest.fn();
  const setOption23 = jest.fn();

  const stateDependencies: StateDependencies<Options> = [
    {
      dependencies: ['option1'],
      setState: setOption1,
    },
    {
      dependencies: ['option2', 'option3'],
      setState: setOption23,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should do nothing', () => {
    const newOptions: Partial<Options> = {};
    updateState(newOptions, stateDependencies);

    expect(setOption1).not.toBeCalled();
    expect(setOption23).not.toBeCalled();
  });

  test('should call every setState callback', () => {
    const newOptions: Partial<Options> = {
      option1: '1',
      option2: 2,
      option3: true,
    };
    updateState(newOptions, stateDependencies);

    expect(setOption1).toBeCalledTimes(1);
    expect(setOption23).toBeCalledTimes(1);
  });
});
