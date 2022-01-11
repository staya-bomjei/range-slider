import { callFunctionsForNewOptions } from '../../helpers/utils';
import { ProgressOptions } from '../types';
import { PROGRESS_HIDDEN } from '../const';

class Progress {
  readonly el: HTMLElement;

  private options: ProgressOptions;

  constructor(el: HTMLElement, options: ProgressOptions) {
    this.el = el;
    this.options = { ...options };
    this.init();
  }

  getOptions(): ProgressOptions {
    return this.options;
  }

  setOptions(options: Partial<ProgressOptions>): void {
    const originalOptions = this.options;
    this.options = { ...originalOptions, ...options };
    callFunctionsForNewOptions(originalOptions, options, [
      {
        dependencies: ['from', 'to'],
        callback: () => this.updatePosition(),
      },
      {
        dependencies: ['visible'],
        callback: () => this.updateVisibility(),
      },
    ]);
  }

  private init(): void {
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
