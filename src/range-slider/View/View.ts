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

  private options: ViewOptions;

  constructor(el: HTMLElement, options: ViewOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.render();
    this.subViews = this.calcSubViews();
    this.updateView();
    this.attachEventHandlers();
  }

  getOptions(): ViewOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ViewOptions>): void {
    const {
      isVertical,
      progress,
      scale,
      leftThumb,
      rightThumb,
      leftTooltip,
      rightTooltip,
    } = options;
    const needToUpdateOrientation = isVertical !== undefined
      && isVertical !== this.options.isVertical;
    const needToUpdateProgress = progress !== undefined && progress !== this.options.progress;
    const needToUpdateScale = scale !== undefined && scale !== this.options.scale;
    const needToUpdateLeftThumb = leftThumb !== undefined
      && leftThumb !== this.options.leftThumb;
    const needToUpdateRightThumb = rightThumb !== undefined
      && rightThumb !== this.options.rightThumb;
    const needToUpdateLeftTooltip = leftTooltip !== undefined
      && leftTooltip !== this.options.leftTooltip;
    const needToUpdateRightTooltip = rightTooltip !== undefined
      && rightTooltip !== this.options.rightTooltip;
    this.options = { ...this.options, ...options };

    if (needToUpdateOrientation) this.updateOrientation(isVertical);
    if (needToUpdateProgress) this.subViews.progress.setOptions(progress);
    if (needToUpdateScale) this.subViews.scale.setOptions(scale);
    if (needToUpdateLeftThumb) this.subViews.leftThumb.setOptions(leftThumb);
    if (needToUpdateRightThumb) this.subViews.rightThumb.setOptions(rightThumb);
    if (needToUpdateLeftTooltip) this.subViews.leftTooltip.setOptions(leftTooltip);
    if (needToUpdateRightTooltip) this.subViews.rightTooltip.setOptions(rightTooltip);
  }

  private updateView(): void {
    const { isVertical } = this.options;
    this.updateOrientation(isVertical);
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

  private updateOrientation(isVertical: boolean): void {
    if (isVertical) {
      this.el.classList.add(RANGE_SLIDER_VERTICAL);
    } else {
      this.el.classList.remove(RANGE_SLIDER_VERTICAL);
    }
  }
}

export default View;
