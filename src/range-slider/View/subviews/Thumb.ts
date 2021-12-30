import { IView } from '../types';

export default class Thumb implements IView {
  readonly el: HTMLElement;

  readonly trackEl: HTMLElement;

  constructor(el: HTMLElement, trackEl: HTMLElement) {
    this.el = el;
    this.trackEl = trackEl;
    this.render();
  }

  public setPosition(position: number) {
    this.el.style.left = `${position}%`;
  }

  public render(): void {
    this.el.addEventListener('mousedown', (e) => this.handleThumbMouseDown(e));
    this.el.addEventListener('ondragstart', () => false);
  }

  private handleThumbMouseDown(event: MouseEvent): void {
    this.moveTo(event.pageX);

    const handleMouseMove = (e: MouseEvent) => {
      this.moveTo(e.pageX);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleMouseMove);
      this.el.onmouseup = null;
    });
  }

  private moveTo(pageX: number) {
    const parentWidth = this.trackEl.offsetWidth;
    const { left: parentLeft } = this.trackEl.getBoundingClientRect();

    let position = pageX - parentLeft;
    position = Math.min(position, parentWidth);
    position = Math.max(0, position);
    position = (position / parentWidth) * 100;

    this.setPosition(position);
  }
}
