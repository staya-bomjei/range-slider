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

  // У меня никак не получается избавиться от этого type assertion,
  // потому что
  private options = {} as ViewOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.render();
    this.subViews = this.calcSubViews();
    this.attachEventHandlers();
  }

  getOptions(): ViewOptions {
    if (this.options === null) {
      throw new Error('you cannot get options without initializing them');
    }

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

    const isAllHTMLElements = trackEl instanceof HTMLElement
      && scaleEl instanceof HTMLElement
      && progressEl instanceof HTMLElement
      && leftThumbEl instanceof HTMLElement
      && rightThumbEl instanceof HTMLElement
      && leftTooltipEl instanceof HTMLElement
      && rightTooltipEl instanceof HTMLElement;
    if (!isAllHTMLElements) {
      throw new Error('can\'t get HTMLElements from render structure');
    }

    return {
      track: new Track(trackEl),
      progress: new Progress(progressEl),
      scale: new Scale(scaleEl),
      leftThumb: new Thumb(leftThumbEl),
      rightThumb: new Thumb(rightThumbEl),
      leftTooltip: new Tooltip(leftTooltipEl),
      rightTooltip: new Tooltip(rightTooltipEl),
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
