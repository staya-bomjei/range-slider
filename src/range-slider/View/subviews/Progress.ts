import { StateDependencies } from '../../helpers/types';
import { getChangedOptions, updateState } from '../../helpers/utils';
import { ProgressOptions } from '../types';
import { PROGRESS_HIDDEN } from '../const';

class Progress {
  private el: HTMLElement;

  private options: ProgressOptions;

  private stateDependencies: StateDependencies<ProgressOptions> = [
    {
      dependencies: ['from', 'to'],
      setState: () => this.updatePosition(),
    },
    {
      dependencies: ['visible'],
      setState: () => this.updateVisibility(),
    },
  ];

  constructor(el: HTMLElement, options: ProgressOptions) {
    this.el = el;
    this.options = { ...options };
    this.update();
  }

  getEl(): HTMLElement {
    return this.el;
  }

  getOptions(): ProgressOptions {
    return { ...this.options };
  }

  setOptions(newOptions: Partial<ProgressOptions>): void {
    const changedOptions = getChangedOptions(this.options, newOptions);
    this.options = { ...this.options, ...changedOptions };
    this.update(changedOptions);
  }

  private update(options?: Partial<ProgressOptions>): void {
    if (!options) {
      this.updatePosition();
      this.updateVisibility();
    } else {
      updateState(options, this.stateDependencies);
    }
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
