import EventObserver from '../helpers/EventObserver';
import Progress from './subviews/Progress';
import Scale from './subviews/Scale';
import Thumb from './subviews/Thumb';
import Tooltip from './subviews/Tooltip';
import Track from './subviews/Track';
import { ViewCallBack, ViewOptions, IView } from './types';
import {
  RANGE_SLIDER,
  TRACK,
  PROGRESS,
  SCALE,
  THUMB,
  TOOLTIP,
} from './const';

export default class View implements IView {
  private changeObserver: EventObserver<ViewCallBack, ViewOptions>;

  readonly el: HTMLElement;

  private track: Track;

  private progress: Progress;

  private scale: Scale;

  private thumb1: Thumb;

  private thumb2: Thumb;

  private tooltip1: Tooltip;

  private tooltip2: Tooltip;

  constructor(el: HTMLElement) {
    this.changeObserver = new EventObserver();
    this.el = el;
    this.render();

    const [trackEl] = this.el.getElementsByClassName(TRACK)!;
    const [progressEl] = this.el.getElementsByClassName(PROGRESS)!;
    const [thumb1El, thumb2El] = this.el.getElementsByClassName(THUMB)!;
    const [tooltip1El, tooltip2El] = this.el.getElementsByClassName(TOOLTIP)!;
    const [scaleEl] = this.el.getElementsByClassName(SCALE)!;

    this.track = new Track(trackEl as HTMLElement);
    this.progress = new Progress(progressEl as HTMLElement);
    this.thumb1 = new Thumb(thumb1El as HTMLElement, trackEl as HTMLElement);
    this.thumb2 = new Thumb(thumb2El as HTMLElement, trackEl as HTMLElement);
    this.tooltip1 = new Tooltip(tooltip1El as HTMLElement);
    this.tooltip2 = new Tooltip(tooltip2El as HTMLElement);
    this.scale = new Scale(scaleEl as HTMLElement);

    console.log(this.track);
    console.log(this.progress);
    console.log(this.thumb1);
    console.log(this.thumb2);
    console.log(this.tooltip1);
    console.log(this.tooltip2);
    console.log(this.scale);

    this.thumb1.setPosition(50);
    this.thumb2.setPosition(100);
  }

  public onChange(subscriber: ViewCallBack): void {
    this.changeObserver.subscribe(subscriber);
  }

  public render(): void {
    this.el.className = `${RANGE_SLIDER}`;
    this.el.innerHTML = `
      <div class="${TRACK}">
        <div class="${PROGRESS}"></div>
        <div class="${THUMB}">
          <div class="${TOOLTIP}"></div>
        </div>
        <div class="${THUMB}">
          <div class="${TOOLTIP}"></div>
        </div>
      </div>
      <div class="${SCALE}"></div>
    `;
  }
}
