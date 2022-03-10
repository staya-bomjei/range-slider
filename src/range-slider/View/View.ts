import EventObserver from '../helpers/EventObserver';
import { StateDependencies } from '../helpers/types';
import { getChangedOptions, updateState } from '../helpers/utils';
import Track from './subviews/Track';
import Scale from './subviews/Scale';
import Progress from './subviews/Progress';
import Thumb from './subviews/Thumb';
import Tooltip from './subviews/Tooltip';
import {
  ViewOptions,
  SubViews,
  ViewEvent,
  ThumbOptions,
  TooltipOptions,
} from './types';
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
  private subViews: SubViews;

  private el: HTMLElement;

  private options: ViewOptions;

  private stateDependencies: StateDependencies<ViewOptions> = [
    {
      dependencies: ['isVertical'],
      setState: () => this.updateOrientation(),
    },
    {
      dependencies: ['progress'],
      setState: () => this.updateProgress(),
    },
    {
      dependencies: ['scale'],
      setState: () => this.updateScale(),
    },
    {
      dependencies: ['leftThumb'],
      setState: () => this.updateThumb(true),
    },
    {
      dependencies: ['rightThumb'],
      setState: () => this.updateThumb(false),
    },
    {
      dependencies: ['leftTooltip'],
      setState: () => this.updateTooltip(true),
    },
    {
      dependencies: ['rightTooltip'],
      setState: () => this.updateTooltip(false),
    },
  ];

  constructor(el: HTMLElement, options: ViewOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.render();
    this.subViews = this.calcSubViews();
    this.update();
    this.attachEventHandlers();
  }

  getSubViews(): SubViews {
    return this.subViews;
  }

  getEl(): HTMLElement {
    return this.el;
  }

  getOptions(): ViewOptions {
    return { ...this.options };
  }

  setOptions(newOptions: Partial<ViewOptions>): void {
    const changedOptions = getChangedOptions(this.options, newOptions);
    this.options = { ...this.options, ...changedOptions };
    this.update(changedOptions);
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
      progress: new Progress(progressEl, this.options.progress),
      scale: new Scale(scaleEl, this.options.scale),
      leftThumb: new Thumb(leftThumbEl, this.options.leftThumb),
      rightThumb: new Thumb(rightThumbEl, this.options.rightThumb),
      leftTooltip: new Tooltip(leftTooltipEl, this.options.leftTooltip),
      rightTooltip: new Tooltip(rightTooltipEl, this.options.rightTooltip),
    };
  }

  private attachEventHandlers(): void {
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

  private update(options?: Partial<ViewOptions>) {
    if (!options) {
      this.updateOrientation();
      this.updateProgress();
      this.updateScale();
      this.updateThumb(true);
      this.updateThumb(false);
      this.updateTooltip(true);
      this.updateTooltip(false);
    } else {
      updateState(options, this.stateDependencies);
    }
  }

  private updateOrientation(): void {
    const { isVertical } = this.options;

    if (isVertical) {
      this.el.classList.add(RANGE_SLIDER_VERTICAL);
    } else {
      this.el.classList.remove(RANGE_SLIDER_VERTICAL);
    }
  }

  private updateProgress(): void {
    const { progress: options } = this.options;
    this.subViews.progress.setOptions(options);
  }

  private updateScale(): void {
    const { scale: options } = this.options;
    this.subViews.scale.setOptions(options);
  }

  private updateThumb(isLeft: boolean): void {
    let thumb: Thumb;
    let options: ThumbOptions;

    if (isLeft) {
      thumb = this.subViews.leftThumb;
      options = this.options.leftThumb;
    } else {
      thumb = this.subViews.rightThumb;
      options = this.options.rightThumb;
    }

    thumb.setOptions(options);
  }

  private updateTooltip(isLeft: boolean): void {
    let tooltip: Tooltip;
    let options: TooltipOptions;

    if (isLeft) {
      tooltip = this.subViews.leftTooltip;
      options = this.options.leftTooltip;
    } else {
      tooltip = this.subViews.rightTooltip;
      options = this.options.rightTooltip;
    }

    tooltip.setOptions(options);
  }
}

export default View;
