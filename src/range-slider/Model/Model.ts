import EventObserver from '../helpers/EventObserver';
import { Options, OptionsCallback } from '../Options/types';
import defaultOptions from '../Options/default';

export default class Model {
  private changeObserver: EventObserver<OptionsCallback, Options>;

  private options: Options;

  constructor(options?: Options) {
    this.changeObserver = new EventObserver();
    this.options = {} as Options;

    if (options) {
      this.setOptions(options, false);
    } else {
      this.setOptions(defaultOptions, false);
    }
  }

  public getOptions(): Options {
    return { ...this.options };
  }

  public setOptions(options: Options, withBroadcast: boolean = true): void {
    this.options = { ...options };

    if (withBroadcast) {
      this.changeObserver.broadcast(this.options);
    }
  }

  public onChange(subscriber: OptionsCallback): void {
    this.changeObserver.subscribe(subscriber);
  }
}
