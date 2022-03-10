import { StateDependencies } from '../../helpers/types';
import { getChangedOptions, updateState } from '../../helpers/utils';
import { TooltipOptions } from '../types';
import { TOOLTIP_HIDDEN } from '../const';

class Tooltip {
  private el: HTMLElement;

  private options: TooltipOptions;

  private stateDependencies: StateDependencies<TooltipOptions> = [
    {
      dependencies: ['visible'],
      setState: () => this.updateVisibility(),
    },
    {
      dependencies: ['text'],
      setState: () => this.updateText(),
    },
  ];

  constructor(el: HTMLElement, options: TooltipOptions) {
    this.el = el;
    this.options = { ...options };
    this.update();
  }

  getEl(): HTMLElement {
    return this.el;
  }

  getOptions(): TooltipOptions {
    return { ...this.options };
  }

  setOptions(newOptions: Partial<TooltipOptions>): void {
    const changedOptions = getChangedOptions(this.options, newOptions);
    this.options = { ...this.options, ...changedOptions };
    this.update(changedOptions);
  }

  private update(options?: Partial<TooltipOptions>): void {
    if (!options) {
      this.updateText();
      this.updateVisibility();
    } else {
      updateState(options, this.stateDependencies);
    }
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
