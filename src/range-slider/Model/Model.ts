import { calcNearestStepValue } from '../helpers/utils';
import EventObserver from '../helpers/EventObserver';
import { ModelOptions } from './types';
import { defaultOptions } from './const';
import IncorrectValueError from '../helpers/IncorrectValueError';

class Model extends EventObserver<Partial<ModelOptions>> {
  private options: ModelOptions;

  constructor(options?: Partial<ModelOptions>) {
    super();

    this.options = defaultOptions;
    if (options) this.setOptions(options);
  }

  getOptions(): ModelOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ModelOptions>): void {
    this.checkRange(options);
    if (options.isRange === false) delete this.options.valueTo;
    Model.checkStrings(options);
    const hasNoNewOptions = Object.keys(options).length === 0;

    if (hasNoNewOptions) return;

    const checkedNewOptions = this.validateStrings(options);
    const mergedOptions = { ...this.options, ...checkedNewOptions };
    Model.checkOptions(mergedOptions);
    this.options = mergedOptions;
    this.broadcast(checkedNewOptions);
  }

  private validateStrings(options: Partial<ModelOptions>): Partial<ModelOptions> {
    const { strings, isRange, valueFrom } = options;

    if (strings !== undefined) {
      const newOptions = {
        min: 0,
        max: strings.length - 1,
        step: 1,
        valueFrom: (valueFrom !== undefined) ? valueFrom : 0,
        scaleParts: strings.length - 1,
        ...options,
      };

      const needToAddValueTo = this.options.isRange || isRange;
      if (needToAddValueTo) {
        newOptions.valueTo = strings.length - 1;
      }

      return newOptions;
    }

    return options;
  }

  private checkRange(options: Partial<ModelOptions>): void {
    const { valueTo, isRange } = options;

    const hasNoValueTo = isRange && valueTo === undefined;
    if (hasNoValueTo) {
      Model.throwError('isRange', 'valueTo is expected instead of isRange: true');
    }

    const { isRange: originalIsRange } = this.options;

    const uselessValueTo = !originalIsRange && !isRange && valueTo !== undefined;
    if (uselessValueTo) {
      Model.throwError('isRange', `valueTo(${valueTo}) not allowed when isRange: false`);
    }
  }

  static checkStrings(options: Partial<ModelOptions>): void {
    const {
      min,
      max,
      step,
      strings,
    } = options;
    const stringsDefined = strings !== undefined;
    const minDefined = min !== undefined;
    const maxDefined = max !== undefined;
    const stepDefined = step !== undefined;
    const needToThrowError = stringsDefined && (minDefined || maxDefined || stepDefined);

    if (needToThrowError) {
      Model.throwError('strings', 'you can\'t set strings with min, max, step');
    }
  }

  static checkOptions(options: ModelOptions): void {
    const {
      min,
      max,
      step,
      valueFrom,
      valueTo,
      scaleParts,
    } = options;

    if (min >= max) {
      Model.throwError('min', 'min cannot be greater than or equal to max');
    }
    if (step <= 0) {
      Model.throwError('step', 'step cannot be less than or equal to zero');
    }
    const valueFromNotInRange = valueFrom > max || valueFrom < min;
    if (valueFromNotInRange) {
      Model.throwError('valueFrom', `valueFrom(${valueFrom}) must be between ${min} and ${max}`);
    }
    const isIncorrectValueFrom = valueFrom !== max
      && valueFrom !== calcNearestStepValue(valueFrom, step, min);
    if (isIncorrectValueFrom) {
      Model.throwError('valueFrom', `valueFrom(${valueFrom}) must be a multiple of ${step}`);
    }
    const valueToNotInRange = valueTo !== undefined && (valueTo > max || valueTo < min);
    if (valueToNotInRange) {
      Model.throwError('valueTo', `valueTo(${valueTo}) must be between ${min} and ${max}`);
    }
    const isIncorrectValueTo = valueTo !== undefined
      && valueTo !== calcNearestStepValue(valueTo, step, min)
      && valueTo !== max;
    if (isIncorrectValueTo) {
      Model.throwError('valueTo', `valueTo(${valueTo}) must be a multiple of ${step}`);
    }
    const isValueFromBiggerValueTo = valueTo !== undefined && valueFrom > valueTo;
    if (isValueFromBiggerValueTo) {
      Model.throwError('valueFrom', `valueFrom(${valueFrom}) must be less than ${valueTo}`);
    }
    let maxScaleParts = (max - min) / step;
    maxScaleParts = Math.trunc(maxScaleParts) + Math.ceil(maxScaleParts % 1);
    const scalePartsNotInRange = scaleParts < 1 || scaleParts > maxScaleParts;
    if (scalePartsNotInRange) {
      Model.throwError('scaleParts', `scaleParts(${scaleParts}) must be between 1 and ${maxScaleParts}`);
    }
  }

  static throwError(value: keyof ModelOptions, message: string) {
    throw new IncorrectValueError<ModelOptions>(value, message);
  }
}

export default Model;
