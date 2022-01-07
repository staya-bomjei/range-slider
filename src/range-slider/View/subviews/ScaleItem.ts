import EventObserver from '../../helpers/EventObserver';
import { ScaleItemOptions, ViewEvent } from '../types';
import { SCALE_ITEM } from '../const';

class ScaleItem extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  private options = {} as ScaleItemOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.render();
    this.attachEventHandlers();
  }

  getOptions(): ScaleItemOptions {
    return this.options;
  }

  setOptions(options: Partial<ScaleItemOptions>): void {
    this.options = { ...this.options, ...options };
    this.updateView();
  }

  private render(): void {
    this.el.classList.add(SCALE_ITEM);
    this.el.innerHTML = '';
  }

  private attachEventHandlers(): void {
    this.el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.broadcast({ view: this, event });
    });
  }

  private updateView(): void {
    this.updatePosition();
    this.updateText();
  }

  private updatePosition(): void {
    const { position } = this.options;

    this.el.style.left = `${position}%`;
  }

  private updateText(): void {
    const { text } = this.options;

    this.el.innerHTML = text;
  }
}

export default ScaleItem;
