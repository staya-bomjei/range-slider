import IView from '../interface';
import { TRACK } from '../const';
import Scale from './Scale';
import Thumb from './Thumb';
import Progress from './Progress';

export default class Track implements IView {
  readonly el: HTMLElement;

  private scale: Scale;

  private thumb1: Thumb;

  private thumb2: Thumb;

  private progress: Progress;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();

    const [scaleEl, thumb1El, thumb2El, progressEl] = this.el.children;

    this.scale = new Scale(scaleEl as HTMLElement);
    this.thumb1 = new Thumb(thumb1El as HTMLElement, this.el);
    this.thumb2 = new Thumb(thumb2El as HTMLElement, this.el);
    this.progress = new Progress(progressEl as HTMLElement);
  }

  public getScale(): Scale {
    return this.scale;
  }

  public getThumb(number: number): Thumb {
    if (number === 0) {
      return this.thumb1;
    }
    if (number === 1) {
      return this.thumb2;
    }
    throw new Error(`Track doesn't have thumb №${number}, only 0 | 1 allowed`);
  }

  getProgress(): Progress {
    return this.progress;
  }

  public render(): void {
    this.el.classList.add(TRACK);
    this.el.innerHTML = `
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    `;
  }
}
