import { IView } from '../types';
import { TRACK } from '../const';
import Scale from './Scale';
import Thumb from './Thumb';
import Progress from './Progress';

export default class Track implements IView {
  readonly el: HTMLElement;

  progress = {} as Progress;

  scale = {} as Scale;

  leftThumb = {} as Thumb;

  rightThumb = {} as Thumb;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  render(): void {
    this.el.classList.add(TRACK);
    this.el.innerHTML = '<div></div>'.repeat(4);
    this.renderSubViews();
  }

  private renderSubViews(): void {
    const [scaleEl, leftThumbEl, rightThumbEl, progressEl] = this.el.children;

    this.scale = new Scale(scaleEl as HTMLElement);
    this.leftThumb = new Thumb(leftThumbEl as HTMLElement);
    this.rightThumb = new Thumb(rightThumbEl as HTMLElement);
    this.progress = new Progress(progressEl as HTMLElement);
  }
}
