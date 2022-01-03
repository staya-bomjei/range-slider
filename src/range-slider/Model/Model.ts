import EventObserver from '../helpers/EventObserver';
import { ModelOptions, ModelCallback } from './types';
import defaultOptions from './default';
import { calcDifference } from '../helpers/utils';

export default class Model extends EventObserver<ModelCallback, Partial<ModelOptions>> {
  private options = {} as ModelOptions;

  constructor(options?: ModelOptions) {
    super();

    if (options) {
      this.setOptions(options);
    } else {
      this.setOptions(defaultOptions);
    }
  }

  getOptions(): ModelOptions {
    return this.options;
  }

  setOptions(options: Partial<ModelOptions>): void {
    const newOptions = calcDifference(this.options, options);
    const uncheckedOptions = { ...this.options, ...newOptions };
    const checkedOptions = Model.checkOptions(uncheckedOptions);
    this.options = checkedOptions;
    this.broadcast(newOptions);
  }

  static checkOptions(options: ModelOptions): ModelOptions {
    const {
      min,
      max,
    } = options;

    if (min >= max) {
      throw new Error('min cannot be greater than or equal to max');
    }
    if (max <= min) {
      throw new Error('max cannot be less than or equal to min');
    }
    // TODO

    return options;
  }
}
