import IView from '../interface';
import { TOOLTIP, TOOLTIP_HIDDEN } from '../const';

export default class Tooltip implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public setVisibility(visible: boolean): void {
    if (visible) {
      this.el.classList.remove(TOOLTIP_HIDDEN);
    } else {
      this.el.classList.add(TOOLTIP_HIDDEN);
    }
  }

  public render(): void {
    this.el.classList.add(TOOLTIP);
    this.el.innerHTML = '';
  }
}
