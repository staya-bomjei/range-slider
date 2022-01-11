import {
  calcNearestStepValue,
  valueToPercent,
  calcNewOptions,
  callFunctionsForNewOptions,
  isFirstCloser,
  checkType,
  rectsIntersect,
} from './utils';

describe('calcNearestStepValue function:', () => {
  test('should return 10', () => {
    expect(calcNearestStepValue(11, 10, 0)).toEqual(10);
  });
  test('should return 10', () => {
    expect(calcNearestStepValue(10, 10, 0)).toEqual(10);
  });
  test('should return -10', () => {
    expect(calcNearestStepValue(-15, 10, 0)).toEqual(-10);
  });
  test('should return 0.33', () => {
    expect(calcNearestStepValue(0.3, 0.33, 0)).toEqual(0.33);
  });
  test('should return -44.5', () => {
    expect(calcNearestStepValue(-44.75, 0.5, 0)).toEqual(-44.5);
  });
  test('should throw error', () => {
    expect(() => calcNearestStepValue(-44.75, -23, 0)).toThrow();
  });
});

describe('checkType function:', () => {
  test('should return true', () => {
    expect(checkType(10, 'number')).toEqual(true);
  });
  test('should return true', () => {
    expect(checkType(false, 'boolean')).toEqual(true);
  });
  test('should return true', () => {
    expect(checkType(['1', '2', '3'], 'string[]')).toEqual(true);
  });
  test('should return true', () => {
    expect(checkType('horizontal', 'orientation')).toEqual(true);
  });
  test('should return true', () => {
    expect(checkType('vertical', 'orientation')).toEqual(true);
  });
  test('should return false', () => {
    expect(checkType(['1', '2', 3], 'string[]')).toEqual(false);
  });
  test('should return false', () => {
    expect(checkType('1234', 'number')).toEqual(false);
  });
  test('should return false', () => {
    expect(checkType(1, 'boolean')).toEqual(false);
  });
  test('should return false', () => {
    expect(checkType('verbtical', 'orientation')).toEqual(false);
  });
  test('should return false', () => {
    expect(checkType(true, 'orientation')).toEqual(false);
  });
});

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
  const first = createRect(0, 0, 100, 100);

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
});

describe('calcNewOptions function:', () => {
  test('should return empty object', () => {
    const first = { prop1: 10 };
    const second = {};
    expect(calcNewOptions(first, second)).toMatchObject({});
  });

  test('should return all second properties', () => {
    const first = { prop1: 1, prop2: '', prop3: {} };
    const second = { prop1: 1002, prop2: '1003' };
    expect(calcNewOptions(first, second)).toMatchObject(second);
  });

  test('should return new properties', () => {
    const first = { prop1: 1002, prop2: '1002', prop3: { p: 'p' } };
    const second = { prop1: 1002, prop2: '1003', prop3: { p: 'пэ' } };
    expect(calcNewOptions(first, second)).toMatchObject({ prop2: '1003', prop3: { p: 'пэ' } });
  });
});

describe('callFunctionsForNewOptions function:', () => {
  test('should call all functions for new properties:', () => {
    const first = { prop1: 0, prop2: '1' };
    const second = { prop1: 1, prop2: '1' };
    const prop1Callback = jest.fn();
    const prop2Callback = jest.fn();

    callFunctionsForNewOptions(first, second, [
      {
        dependencies: ['prop1'],
        callback: prop1Callback,
      },
      {
        dependencies: ['prop2'],
        callback: prop2Callback,
      },
    ]);

    expect(prop1Callback).toHaveBeenCalled();
    expect(prop2Callback).not.toHaveBeenCalled();
  });
});
