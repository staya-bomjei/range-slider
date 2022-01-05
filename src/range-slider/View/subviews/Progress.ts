import { callFunctionsForNewOptions } from '../../helpers/utils';
import { ProgressOptions } from '../types';
import { PROGRESS_HIDDEN } from '../const';

export default class Progress {
  readonly el: HTMLElement;

  private options = {} as ProgressOptions;

  constructor(el: HTMLElement) {
    this.el = el;
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
