import { IView, ScaleItemOptions } from '../types';
import { SCALE_ITEM } from '../const';

export default class ScaleItem implements IView {
  readonly el: HTMLElement;

  private options = {} as ScaleItemOptions;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  getOptions(): ScaleItemOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ScaleItemOptions>): void {
    this.options = { ...this.options, ...options };
    this.updateView();
  }

  render(): void {
    this.el.classList.add(SCALE_ITEM);
    this.el.innerHTML = '';
  }

  private updateView(): void {
    this.updatePosition();
    this.updateText();
  }

  private updatePosition(): void {
    const { position } = this.options;

    this.el.style.left = `${position}%`;
  }

  private updateText(): void {
    const { text } = this.options;

    this.el.innerHTML = text;
  }
}
