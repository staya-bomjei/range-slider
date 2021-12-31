import IView from '../interface';
import { PROGRESS, PROGRESS_HIDDEN } from '../const';

export default class Progress implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public setVisibility(visible: boolean): void {
    if (visible) {
      this.el.classList.remove(PROGRESS_HIDDEN);
    } else {
      this.el.classList.add(PROGRESS_HIDDEN);
    }
  }

  public render(): void {
    this.el.classList.add(PROGRESS);
  }
}
