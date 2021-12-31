import IView from '../interface';
import { SCALE } from '../const';

export default class Scale implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public render(): void {
    this.el.classList.add(SCALE, `js-${SCALE}`);
  }
}
