import { TooltipOptions } from '../types';
import { TOOLTIP_HIDDEN } from '../const';

class Tooltip {
  readonly el: HTMLElement;

  private options: TooltipOptions;

  constructor(el: HTMLElement, options: TooltipOptions) {
    this.el = el;
    this.options = { ...options };
    this.updateView();
  }

  getOptions(): TooltipOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<TooltipOptions>): void {
    const { text, visible } = options;
    const needToUpdateText = text !== undefined && text !== this.options.text;
    const needToUpdateVisibility = visible !== undefined && visible !== this.options.visible;
    this.options = { ...this.options, ...options };

    if (needToUpdateText) this.updateText();
    if (needToUpdateVisibility) this.updateVisibility();
  }

  private updateView(): void {
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
