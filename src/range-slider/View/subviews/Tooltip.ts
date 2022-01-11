import { callFunctionsForNewOptions } from '../../helpers/utils';
import { TooltipOptions } from '../types';
import { TOOLTIP_HIDDEN } from '../const';

class Tooltip {
  readonly el: HTMLElement;

  private options: TooltipOptions;

  constructor(el: HTMLElement, options: TooltipOptions) {
    this.el = el;
    this.options = { ...options };
    this.init();
  }

  getOptions(): TooltipOptions {
    return this.options;
  }

  setOptions(options: Partial<TooltipOptions>): void {
    const originalOptions = this.options;
    this.options = { ...originalOptions, ...options };
    callFunctionsForNewOptions(originalOptions, options, [
      {
        dependencies: ['text'],
        callback: () => this.updateText(),
      },
      {
        dependencies: ['visible'],
        callback: () => this.updateVisibility(),
      },
    ]);
  }

  private init(): void {
    this.updateText();
    this.updateVisibility();
  }

  private updateVisibility(): void {
    const { visible } = this.options;

    if (visible) {
      this.el.classList.remove(TOOLTIP_HIDDEN);
    } else {
      this.el.classList.add(TOOLTIP_HIDDEN);
    }
  }

  private updateText(): void {
    const { text } = this.options;

    this.el.innerHTML = text;
  }
}

export default Tooltip;
