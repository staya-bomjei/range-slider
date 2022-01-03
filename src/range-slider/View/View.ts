import { callFunctionsForNewOptions } from '../helpers/utils';
import EventObserver from '../helpers/EventObserver';
import Track from './subviews/Track';
import {
  PROGRESS,
  RANGE_SLIDER,
  SCALE,
  THUMB,
  TOOLTIP,
  TRACK,
  WRAPPER,
} from './const';
import {
  IView,
  ViewOptions,
  SubViews,
  EventCallback,
  ViewEvent,
} from './types';
import Scale from './subviews/Scale';
import Progress from './subviews/Progress';
import Thumb from './subviews/Thumb';
import Tooltip from './subviews/Tooltip';

export default class View extends EventObserver<EventCallback, ViewEvent> implements IView {
  subViews = {} as SubViews;

  readonly el: HTMLElement;

  private options: ViewOptions = {} as ViewOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.render();
    this.attachEventHandlers();
  }

  getOptions(): ViewOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ViewOptions>) {
    const {
      progress,
      scale,
      leftThumb,
      rightThumb,
      leftTooltip,
      rightTooltip,
    } = options;

    // т.к. эта функция проверяет, существуют ли свойства из options, я далее использую '!'
    callFunctionsForNewOptions(this.options, options, [
      {
        dependencies: ['progress'],
        callback: () => this.subViews.progress.setOptions(progress!),
      },
      {
        dependencies: ['scale'],
        callback: () => this.subViews.scale.setOptions(scale!),
      },
      {
        dependencies: ['leftThumb'],
        callback: () => this.subViews.leftThumb.setOptions(leftThumb!),
      },
      {
        dependencies: ['rightThumb'],
        callback: () => this.subViews.rightThumb.setOptions(rightThumb!),
      },
      {
        dependencies: ['leftTooltip'],
        callback: () => this.subViews.leftTooltip.setOptions(leftTooltip!),
      },
      {
        dependencies: ['rightTooltip'],
        callback: () => this.subViews.rightTooltip.setOptions(rightTooltip!),
      },
    ]);
    this.options = { ...this.options, ...options };
  }

  getTrackWidth() {
    return this.subViews.track.el.offsetWidth;
  }

  render(): void {
    this.el.className = `${RANGE_SLIDER}`;
    this.el.innerHTML = `
      <div class="${WRAPPER}">
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
      </div>
    `;
    this.setSubViews();
  }

  private setSubViews() {
    const [wrapperEl] = this.el.children;
    const [trackEl, scaleEl] = wrapperEl!.children;
    const [progressEl, leftThumbEl, rightThumbEl] = trackEl!.children;
    const [leftTooltipEl] = leftThumbEl!.children;
    const [rightTooltipEl] = rightThumbEl!.children;
    const track = new Track(trackEl as HTMLElement);
    const scale = new Scale(scaleEl as HTMLElement);
    const progress = new Progress(progressEl as HTMLElement);
    const leftThumb = new Thumb(leftThumbEl as HTMLElement);
    const rightThumb = new Thumb(rightThumbEl as HTMLElement);
    const leftTooltip = new Tooltip(leftTooltipEl as HTMLElement);
    const rightTooltip = new Tooltip(rightTooltipEl as HTMLElement);
    this.subViews = {
      track,
      progress,
      scale,
      leftThumb,
      rightThumb,
      leftTooltip,
      rightTooltip,
    };
  }

  private attachEventHandlers() {
    const {
      track,
      scale,
      leftThumb,
      rightThumb,
    } = this.subViews;

    track.subscribe((event) => this.broadcast(event));
    scale.subscribe((event) => this.broadcast(event));
    leftThumb.subscribe((event) => this.broadcast(event));
    rightThumb.subscribe((event) => this.broadcast(event));
  }
}
