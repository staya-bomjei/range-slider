import { calcNearestStepValue } from '../../helpers/utils';
import { THUMB, THUMB_HIDDEN, THUMB_DRAGGED } from '../const';
import IView from '../interface';
import Tooltip from './Tooltip';
import { ThumbOptions } from './types';

export default class Thumb implements IView {
  readonly el: HTMLElement;

  readonly trackEl: HTMLElement;

  private tooltip: Tooltip;

  private options: ThumbOptions;

  constructor(el: HTMLElement, trackEl: HTMLElement) {
    this.options = {} as ThumbOptions;
    this.el = el;
    this.trackEl = trackEl;
    this.render();

    const [tooltipEl] = this.el.children;
    this.tooltip = new Tooltip(tooltipEl as HTMLElement);

    this.attachEventHandlers();
  }

  public getOptions(): ThumbOptions {
    return { ...this.options };
  }

  public setOptions(options: ThumbOptions) {
    const {
      percentStep,
      visible,
      value,
      showTooltip,
      showTooltipAfterDrag,
    } = options;

    if (percentStep !== undefined) {
      this.options.percentStep = percentStep;
    }
    if (visible !== undefined) {
      this.setVisibility(visible);
    }
    if (value !== undefined) {
      this.setPosition(value);
    }
    if (showTooltip !== undefined) {
      this.setTooltipVisibility(showTooltip);
    }
    if (showTooltipAfterDrag !== undefined) {
      this.setTooltipVisibility(false);
      this.options.showTooltipAfterDrag = showTooltipAfterDrag;
    }
  }

  public getTooltip(): Tooltip {
    return this.tooltip;
  }

  public render(): void {
    this.el.classList.add(THUMB);
    this.el.innerHTML = '<div><div>';
  }

  private setVisibility(visible: boolean): void {
    this.options.visible = visible;

    if (visible) {
      this.el.classList.remove(THUMB_HIDDEN);
    } else {
      this.el.classList.add(THUMB_HIDDEN);
    }
  }

  private setTooltipVisibility(visible: boolean): void {
    this.options.showTooltip = visible;
    this.tooltip.setVisibility(visible);
  }

  private setPosition(position: number) {
    this.options.value = position;
    this.el.style.left = `${position}%`;
  }

  private attachEventHandlers(): void {
    this.el.addEventListener('mousedown', (e) => this.handleThumbMouseDown(e));
    this.el.addEventListener('ondragstart', () => false);
  }

  private handleThumbMouseDown(event: MouseEvent): void {
    this.el.classList.add(THUMB_DRAGGED);
    this.moveTo(event.pageX);
    const { showTooltipAfterDrag } = this.options;
    if (showTooltipAfterDrag) this.setTooltipVisibility(true);

    const handleMouseMove = (e: MouseEvent) => {
      this.moveTo(e.pageX);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      this.el.classList.remove(THUMB_DRAGGED);
      if (showTooltipAfterDrag) this.setTooltipVisibility(true);
      document.removeEventListener('mousemove', handleMouseMove);
      this.el.onmouseup = null;
    });
  }

  private moveTo(pageX: number) {
    const { percentStep } = this.options;
    const parentWidth = this.trackEl.offsetWidth;
    const { left: parentLeft } = this.trackEl.getBoundingClientRect();

    let position = pageX - parentLeft;
    position = Math.min(position, parentWidth);
    position = Math.max(0, position);
    position = (position / parentWidth) * 100;
    position = calcNearestStepValue(position, percentStep);

    this.setPosition(position);
  }
}
