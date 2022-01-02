import { callFunctionsForNewOptions } from '../helpers/utils';
import EventObserver from '../helpers/EventObserver';
import Track from './subviews/Track';
import { RANGE_SLIDER } from './const';
import {
  IView,
  ViewOptions,
  SubViews,
  EventCallback,
  ViewEvent,
} from './types';

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
    this.el.innerHTML = '<div></div>';
    this.renderSubViews();
  }

  private renderSubViews() {
    const [trackEl] = this.el.children;
    const track = new Track(trackEl as HTMLElement);
    const {
      progress,
      scale,
      leftThumb,
      rightThumb,
    } = track;
    this.subViews = {
      track,
      progress,
      scale,
      leftThumb,
      rightThumb,
      leftTooltip: leftThumb.tooltip,
      rightTooltip: rightThumb.tooltip,
    };
  }

  private attachEventHandlers() {
    const { scale, leftThumb, rightThumb } = this.subViews;

    scale.subscribe((event) => this.broadcast(event));
    leftThumb.subscribe((event) => this.broadcast(event));
    rightThumb.subscribe((event) => this.broadcast(event));
  }
}
