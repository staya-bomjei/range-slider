import {
  calcNearestStepValue,
  valueToPercent,
  calcDifference,
  callFunctionsForNewOptions,
  isFirstCloser,
  checkType,
  rectsIntersect,
} from './utils';

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
  const baseRect = {
    height: 100,
    width: 100,
    top: 0,
    bottom: 100,
    left: 0,
    right: 100,
  } as DOMRect;

  test('should return true', () => {
    const first = { ...baseRect };
    const second = { ...baseRect, left: 99, right: 199 };
    expect(rectsIntersect(first, second)).toEqual(true);
  });

  test('should return false', () => {
    const first = { ...baseRect };
    const second = { ...baseRect, left: 100, right: 200 };
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return true', () => {
    const first = { ...baseRect };
    const second = { ...baseRect, top: 99, bottom: 199 };
    expect(rectsIntersect(first, second)).toEqual(true);
  });

  test('should return false', () => {
    const first = { ...baseRect };
    const second = { ...baseRect, top: 100, bottom: 200 };
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return false', () => {
    const first = { ...baseRect };
    const second = { height: 0 } as DOMRect;
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return false', () => {
    const second = { ...baseRect };
    const first = { height: 0 } as DOMRect;
    expect(rectsIntersect(first, second)).toEqual(false);
  });

  test('should return false', () => {
    const second = { height: 0 } as DOMRect;
    const first = { height: 0 } as DOMRect;
    expect(rectsIntersect(first, second)).toEqual(false);
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

describe('calcDifference function:', () => {
  type TestObject = {
    prop1: number,
    prop2: string,
    prop3: Record<string, unknown>,
   };

  test('should return empty object', () => {
    const first = { prop1: 10 } as TestObject;
    const second = {} as TestObject;
    expect(calcDifference(first, second)).toMatchObject({});
  });

  test('should return all second properties', () => {
    const first = { prop3: {} } as TestObject;
    const second = { prop1: 1002, prop2: '1003' } as TestObject;
    expect(calcDifference(first, second)).toMatchObject(second);
  });

  test('should return new properties', () => {
    const first = { prop1: 1002, prop2: '1002' } as TestObject;
    const second = { prop1: 1002, prop2: '1003', prop3: {} } as TestObject;
    expect(calcDifference(first, second)).toMatchObject({ prop2: '1003', prop3: {} });
  });
});

describe('callFunctionsForNewOptions function:', () => {
  type TestObject = {
    prop1: number,
    prop2: string,
   };

  test('should call all functions for new properties:', () => {
    const first = { prop1: 0, prop2: '1' } as TestObject;
    const second = { prop1: 1, prop2: '1' } as TestObject;
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
