import { IView } from '../types';
import { TRACK } from '../const';

export default class Track implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public render(): void {
    this.el.classList.add(TRACK, `js-${TRACK}`);
  }
}
