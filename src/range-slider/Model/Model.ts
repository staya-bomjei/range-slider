import EventObserver from '../helpers/EventObserver';
import { Options, OptionsCallback } from '../Options/types';
import defaultOptions from '../Options/default';
import { calcDifference } from '../helpers/utils';

export default class Model {
  private changeObserver: EventObserver<OptionsCallback, Options>;

  private options = {} as Options;

  constructor(options?: Options) {
    this.changeObserver = new EventObserver();

    if (options) {
      this.setOptions(options, false);
    } else {
      this.setOptions(defaultOptions, false);
    }
  }

  public getOptions(): Options {
    return { ...this.options };
  }

  public setOptions(options: Partial<Options>, withBroadcast: boolean = true): void {
    const newOptions = calcDifference(this.options, options);
    // здесь нужно провести валидацию newOptions с учётом недостающих частей
    this.options = { ...this.options, ...newOptions };

    if (withBroadcast) {
      this.changeObserver.broadcast(newOptions);
    }
  }

  public onChange(subscriber: OptionsCallback): void {
    this.changeObserver.subscribe(subscriber);
  }
}
