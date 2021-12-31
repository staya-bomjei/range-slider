import IView from '../interface';
import { TOOLTIP } from '../const';

export default class Tooltip implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public render(): void {
    this.el.classList.add(TOOLTIP, `js-${TOOLTIP}`);
  }
}
