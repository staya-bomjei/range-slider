import { calcDifference, hasAnyKey, valueToPercent } from '../helpers/utils';
import EventObserver from '../helpers/EventObserver';
import { Options, OptionsCallback } from '../Options/types';
import Progress from './subviews/Progress';
import Scale from './subviews/Scale';
import Thumb from './subviews/Thumb';
import Tooltip from './subviews/Tooltip';
import Track from './subviews/Track';
import { thumbDependencies, ThumbOptions } from './subviews/types';
import IView from './interface';
import { RANGE_SLIDER } from './const';

export default class View implements IView {
  private changeObserver: EventObserver<OptionsCallback, Options>;

  private options: Options = {} as Options;

  readonly el: HTMLElement;

  private track: Track;

  private progress: Progress;

  private scale: Scale;

  private thumb1: Thumb;

  private thumb2: Thumb;

  private tooltip1: Tooltip;

  private tooltip2: Tooltip;

  constructor(el: HTMLElement, options: Options) {
    this.changeObserver = new EventObserver();
    this.el = el;
    this.render();

    const [trackEl] = this.el.children;

    this.track = new Track(trackEl as HTMLElement);
    this.progress = this.track.getProgress();
    this.thumb1 = this.track.getThumb(0);
    this.thumb2 = this.track.getThumb(1);
    this.tooltip1 = this.thumb1.getTooltip();
    this.tooltip2 = this.thumb2.getTooltip();
    this.scale = this.track.getScale();

    console.log(this.progress);
    console.log(this.tooltip1);
    console.log(this.tooltip2);
    console.log(this.scale);

    this.setOptions(options);
  }

  public getOptions(): Options {
    return { ...this.options };
  }

  public setOptions(options: Options) {
    this.options = { ...this.options, ...options };

    if (hasAnyKey(thumbDependencies, options)) {
      const thumbOptions1 = this.calcThumbOptions(true);
      const newThumbOptions1 = calcDifference(this.thumb1.getOptions(), thumbOptions1);
      this.thumb1.setOptions(newThumbOptions1);
      const thumbOptions2 = this.calcThumbOptions(false);
      const newThumbOptions2 = calcDifference(this.thumb2.getOptions(), thumbOptions2);
      this.thumb2.setOptions(newThumbOptions2);
    }
  }

  public onChange(subscriber: OptionsCallback): void {
    this.changeObserver.subscribe(subscriber);
  }

  public render(): void {
    this.el.className = `${RANGE_SLIDER}`;
    this.el.innerHTML = `
      <div></div>
    `;
  }

  // private updateView(): void {
  //   const thumbOptions1 = this.calcThumbOptions(true);
  //   this.thumb1.setOptions(thumbOptions1);

  //   const thumbOptions2 = this.calcThumbOptions(false);
  //   this.thumb2.setOptions(thumbOptions2);
  // }

  private calcThumbOptions(isFirst: boolean): ThumbOptions {
    const {
      min,
      max,
      step,
      valueFrom,
      valueTo,
      isRange,
      showTooltip,
      showTooltipAfterDrag,
    } = this.options;

    const valuesRange = max - min;
    const percentStep = valueToPercent(step, valuesRange);

    let value = (isFirst) ? valueFrom : valueTo;
    value = valueToPercent(value - min, valuesRange);

    const visible = isFirst || isRange;

    const thumbOptions: ThumbOptions = {
      percentStep,
      visible,
      value,
    };
    if (showTooltip) thumbOptions.showTooltip = showTooltip;
    if (showTooltipAfterDrag) thumbOptions.showTooltipAfterDrag = showTooltipAfterDrag;

    return thumbOptions;
  }
}
