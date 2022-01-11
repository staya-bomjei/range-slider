import EventObserver from '../../helpers/EventObserver';
import { ScaleItemOptions, ViewEvent } from '../types';
import { SCALE_ITEM } from '../const';

class ScaleItem extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  private options: ScaleItemOptions;

  constructor(el: HTMLElement, options: ScaleItemOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.render();
    this.updateView();
    this.attachEventHandlers();
  }

  getOptions(): ScaleItemOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ScaleItemOptions>): void {
    const { position, text } = options;
    const needToUpdatePosition = position !== undefined && position !== this.options.position;
    const needToUpdateText = text !== undefined && text !== this.options.text;
    this.options = { ...this.options, ...options };

    if (needToUpdatePosition) this.updatePosition();
    if (needToUpdateText) this.updateText();
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
