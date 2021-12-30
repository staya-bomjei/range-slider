import EventObserver from '../helpers/EventObserver';
import { ModelCallback, ModelOptions } from './types';
import defaultOptions from './default-options';

export default class Model {
  private changeObserver: EventObserver<ModelCallback, ModelOptions>;

  private options: ModelOptions;

  constructor(options?: ModelOptions) {
    this.changeObserver = new EventObserver();
    this.options = {} as ModelOptions;

    if (options) {
      this.setOptions(options, false);
    } else {
      this.setOptions(defaultOptions, false);
    }
  }

  public getOptions(): ModelOptions {
    return { ...this.options };
  }

  public setOptions(options: ModelOptions, withBroadcast: boolean = true): void {
    this.options = { ...options };

    if (withBroadcast) {
      this.changeObserver.broadcast(this.options);
    }
  }

  public onChange(subscriber: ModelCallback): void {
    this.changeObserver.subscribe(subscriber);
  }
}
