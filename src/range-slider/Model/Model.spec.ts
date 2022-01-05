import Model from './Model';
import { defaultOptions } from './const';

describe('Model class:', () => {
  test('should return default options', () => {
    const model = new Model();
    const modelOptions = model.getOptions();
    expect(modelOptions).toMatchObject(defaultOptions);
  });
  test('should extend default options', () => {
    const newOptions = { valueFrom: 50 };
    const model = new Model(newOptions);
    const modelOptions = model.getOptions();
    expect(modelOptions).toMatchObject({ ...defaultOptions, ...newOptions });
  });
  test('should update valueFrom to 100', () => {
    const model = new Model();
    model.setOptions({ valueFrom: 100 });
    const modelOptions = model.getOptions();
    expect(modelOptions.valueFrom).toEqual(100);
  });
  test('should update strings, min, max, step', () => {
    const model = new Model();
    const newStrings = ['one', 'two', 'three', 'four', 'five'];
    model.setOptions({ valueFrom: 0, strings: [...newStrings] });
    const {
      min,
      max,
      step,
      strings,
    } = model.getOptions();
    expect(min).toEqual(0);
    expect(max).toEqual(4);
    expect(step).toEqual(1);
    expect(strings).toMatchObject(newStrings);
  });
  test('should throw error', () => {
    const model = new Model();
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
    const model = new Model();
    const newOptions = {
      strings: ['one', 'two', 'three', 'four', 'five'],
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(50) must be between 0 and 4');
  });
  test('should throw error', () => {
    const model = new Model();
    const newOptions = {
      min: 101,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('min cannot be greater than or equal to max');
  });
  test('should throw error', () => {
    const model = new Model();
    const newOptions = {
      step: -1,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('step cannot be less than or equal to zero');
  });
  test('should throw error', () => {
    const model = new Model();
    const newOptions = {
      valueTo: 44,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueTo(44) not allowed when isRange: false');
  });
  test('should throw error', () => {
    const model = new Model();
    const newOptions = {
      valueFrom: -2,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(-2) must be between 0 and 100');
  });
  test('should throw error', () => {
    const model = new Model();
    const newOptions = {
      isRange: true,
      valueTo: -2,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueTo(-2) must be between 0 and 100');
  });
  test('should throw error', () => {
    const model = new Model();
    const newOptions = {
      valueFrom: 0.5,
    };

    expect(() => {
      model.setOptions(newOptions);
    }).toThrow('valueFrom(0.5) must be a multiple of 1');
  });
  test('should throw error', () => {
    const model = new Model();
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
    const model = new Model();
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
