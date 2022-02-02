import Model from './Model';
import { defaultOptions } from './const';

describe('Model class:', () => {
  let model: Model;

  beforeEach(() => {
    model = new Model();
  });

  test('should return default options', () => {
    const modelOptions = model.getOptions();
    expect(modelOptions).toMatchObject(defaultOptions);
  });

  test('should extend default options', () => {
    const newOptions = { valueFrom: 50 };
    model.setOptions(newOptions);

    const modelOptions = model.getOptions();
    expect(modelOptions).toMatchObject({ ...defaultOptions, ...newOptions });
  });

  test('should update valueFrom to 100', () => {
    const newOptions = { valueFrom: 100 };
    model.setOptions(newOptions);

    const modelOptions = model.getOptions();
    expect(modelOptions.valueFrom).toEqual(100);
  });

  test('should update strings, min, max, step', () => {
    const newOptions = {
      valueFrom: 0,
      strings: ['one', 'two', 'three', 'four', 'five'],
    };
    model.setOptions(newOptions);

    const {
      min,
      max,
      step,
      strings,
    } = model.getOptions();
    expect(min).toEqual(0);
    expect(max).toEqual(4);
    expect(step).toEqual(1);
    expect(strings).toMatchObject(newOptions.strings);
  });

  test('should throw error', () => {
    const newOptions = {
      valueFrom: 0,
      step: 1,
      strings: ['one', 'two', 'three', 'four', 'five'],
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('you can\'t set strings with min, max, step');
  });

  test('should throw error', () => {
    const newOptions = {
      valueFrom: 51,
      strings: ['one', 'two', 'three', 'four', 'five'],
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(51) must be between 0 and 4');
  });

  test('should throw error', () => {
    const newOptions = { min: 101 };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('min cannot be greater than or equal to max');
  });

  test('should throw error', () => {
    const newOptions = { step: -1 };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('step cannot be less than or equal to zero');
  });

  test('should throw error', () => {
    const newOptions = { valueTo: 44 };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueTo(44) not allowed when isRange: false');
  });

  test('should throw error', () => {
    const newOptions = { valueFrom: -2 };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(-2) must be between 0 and 100');
  });

  test('should throw error', () => {
    const newOptions = { isRange: true, valueTo: -2 };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueTo(-2) must be between 0 and 100');
  });

  test('should throw error', () => {
    const newOptions = { valueFrom: 0.5 };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(0.5) must be a multiple of 1');
  });

  test('should throw error', () => {
    const newOptions = {
      isRange: true,
      step: 3,
      valueFrom: 9,
      valueTo: 50.00001,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueTo(50.00001) must be a multiple of 3');
  });

  test('should throw error', () => {
    const newOptions = {
      isRange: true,
      step: 3,
      valueFrom: 9,
      valueTo: 6,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(9) must be less than 6');
  });

  test('should throw error', () => {
    const newOptions = {
      min: 0,
      max: 3,
      valueFrom: 3,
      scaleParts: 5,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('scaleParts(5) must be between 1 and 3');
  });
});
