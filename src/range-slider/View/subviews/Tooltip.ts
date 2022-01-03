import { callFunctionsForNewOptions } from '../../helpers/utils';
import { IView, TooltipOptions } from '../types';
import { TOOLTIP_HIDDEN } from '../const';

export default class Tooltip implements IView {
  readonly el: HTMLElement;

  private options = {} as TooltipOptions;

  constructor(el: HTMLElement) {
    this.el = el;
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
