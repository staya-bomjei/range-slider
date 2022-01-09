import { callFunctionsForNewOptions } from '../helpers/utils';
import EventObserver from '../helpers/EventObserver';
import Track from './subviews/Track';
import Scale from './subviews/Scale';
import Progress from './subviews/Progress';
import Thumb from './subviews/Thumb';
import Tooltip from './subviews/Tooltip';
import { ViewOptions, SubViews, ViewEvent } from './types';
import {
  PROGRESS,
  RANGE_SLIDER,
  RANGE_SLIDER_VERTICAL,
  SCALE,
  THUMB,
  TOOLTIP,
  TRACK,
  WRAPPER,
} from './const';

class View extends EventObserver<ViewEvent> {
  subViews: SubViews;

  readonly el: HTMLElement;

  private options: ViewOptions = {} as ViewOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.render();
    this.subViews = this.calcSubViews();
    this.attachEventHandlers();
  }

  getOptions(): ViewOptions {
    return this.options;
  }

  setOptions(options: Partial<ViewOptions>) {
    const {
      isVertical,
      progress,
      scale,
      leftThumb,
      rightThumb,
      leftTooltip,
      rightTooltip,
    } = options;

    callFunctionsForNewOptions(this.options, options, [
      {
        dependencies: ['isVertical'],
        callback: () => {
          if (isVertical === undefined) return;
          this.updateOrientation(isVertical);
        },
      },
      {
        dependencies: ['progress'],
        callback: () => {
          if (progress === undefined) return;
          this.subViews.progress.setOptions(progress);
        },
      },
      {
        dependencies: ['scale'],
        callback: () => {
          if (scale === undefined) return;
          this.subViews.scale.setOptions(scale);
        },
      },
      {
        dependencies: ['leftThumb'],
        callback: () => {
          if (leftThumb === undefined) return;
          this.subViews.leftThumb.setOptions(leftThumb);
        },
      },
      {
        dependencies: ['rightThumb'],
        callback: () => {
          if (rightThumb === undefined) return;
          this.subViews.rightThumb.setOptions(rightThumb);
        },
      },
      {
        dependencies: ['leftTooltip'],
        callback: () => {
          if (leftTooltip === undefined) return;
          this.subViews.leftTooltip.setOptions(leftTooltip);
        },
      },
      {
        dependencies: ['rightTooltip'],
        callback: () => {
          if (rightTooltip === undefined) return;
          this.subViews.rightTooltip.setOptions(rightTooltip);
        },
      },
    ]);
    this.options = { ...this.options, ...options };
  }

  private render(): void {
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
  }

  private calcSubViews(): SubViews {
    const [wrapperEl] = this.el.children;
    if (wrapperEl === undefined) throw new Error('render does wrong dom structure');

    const [trackEl, scaleEl] = wrapperEl.children;
    const hasNoTrackOrScale = scaleEl === undefined || trackEl === undefined;
    if (hasNoTrackOrScale) throw new Error('render does wrong dom structure');

    const [progressEl, leftThumbEl, rightThumbEl] = trackEl.children;
    const hasNoThumbsOrProgress = progressEl === undefined
      || leftThumbEl === undefined
      || rightThumbEl === undefined;
    if (hasNoThumbsOrProgress) throw new Error('render does wrong dom structure');

    const [leftTooltipEl] = leftThumbEl.children;
    const [rightTooltipEl] = rightThumbEl.children;
    const hasNoTooltips = leftTooltipEl === undefined || rightTooltipEl === undefined;
    if (hasNoTooltips) throw new Error('render does wrong dom structure');

    // Далее использую type assertions т.к. это единственная возможность привести
    // Element к HTMLElement, при том гарантируется, что у приведённого объекта будут
    // все нужные свойства.
    const track = new Track(trackEl as HTMLElement);
    const scale = new Scale(scaleEl as HTMLElement);
    const progress = new Progress(progressEl as HTMLElement);
    const leftThumb = new Thumb(leftThumbEl as HTMLElement);
    const rightThumb = new Thumb(rightThumbEl as HTMLElement);
    const leftTooltip = new Tooltip(leftTooltipEl as HTMLElement);
    const rightTooltip = new Tooltip(rightTooltipEl as HTMLElement);
    return {
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

  private updateOrientation(isVertical: boolean): void {
    if (isVertical) {
      this.el.classList.add(RANGE_SLIDER_VERTICAL);
    } else {
      this.el.classList.remove(RANGE_SLIDER_VERTICAL);
    }
  }
}

export default View;
