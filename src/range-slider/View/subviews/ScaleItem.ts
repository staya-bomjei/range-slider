import IView from '../interface';
import { SCALE_ITEM } from '../const';

export default class ScaleItem implements IView {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  public setPosition(position: number) {
    this.el.style.left = `${position}%`;
  }

  public setText(text: string): void {
    this.el.innerHTML = text;
  }

  public render(): void {
    this.el.classList.add(SCALE_ITEM);
    this.el.innerHTML = '';
  }
}
