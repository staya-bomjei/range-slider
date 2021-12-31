import IView from '../interface';
import { PROGRESS } from '../const';

export default class Progress implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public render(): void {
    this.el.classList.add(PROGRESS, `js-${PROGRESS}`);
  }
}
