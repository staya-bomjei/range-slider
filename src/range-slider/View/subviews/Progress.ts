import { ProgressOptions } from '../types';
import { PROGRESS_HIDDEN } from '../const';

class Progress {
  readonly el: HTMLElement;

  private options: ProgressOptions;

  constructor(el: HTMLElement, options: ProgressOptions) {
    this.el = el;
    this.options = { ...options };
    this.updateView();
  }

  getOptions(): ProgressOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ProgressOptions>): void {
    const { from, to, visible } = options;
    const needToUpdatePosition = (from !== undefined && from !== this.options.from)
      || (to !== undefined && to !== this.options.to);
    const needToUpdateVisibility = visible !== undefined && visible !== this.options.visible;
    this.options = { ...this.options, ...options };

    if (needToUpdatePosition) this.updatePosition();
    if (needToUpdateVisibility) this.updateVisibility();
  }

  private updateView(): void {
    this.updatePosition();
    this.updateVisibility();
  }

  private updateVisibility(): void {
    const { visible } = this.options;

    if (visible) {
      this.el.classList.remove(PROGRESS_HIDDEN);
    } else {
      this.el.classList.add(PROGRESS_HIDDEN);
    }
  }

  private updatePosition(): void {
    const { from, to } = this.options;

    this.el.style.width = `${to - from}%`;
    this.el.style.left = `${from}%`;
  }
}

export default Progress;
