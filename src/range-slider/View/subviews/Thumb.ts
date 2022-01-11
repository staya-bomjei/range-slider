import EventObserver from '../../helpers/EventObserver';
import { THUMB_HIDDEN, THUMB_HIGHER } from '../const';
import { ThumbOptions, ViewEvent } from '../types';

class Thumb extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  private options: ThumbOptions;

  constructor(el: HTMLElement, options: ThumbOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.updateView();
    this.attachEventHandlers();
  }

  getOptions(): ThumbOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ThumbOptions>): void {
    const { position, visible, isHigher } = options;
    const needToUpdatePosition = position !== undefined && position !== this.options.position;
    const needToUpdateVisibility = visible !== undefined && visible !== this.options.visible;
    const needToUpdateZIndex = isHigher !== undefined && isHigher !== this.options.isHigher;
    this.options = { ...this.options, ...options };

    if (needToUpdatePosition) this.updatePosition();
    if (needToUpdateVisibility) this.updateVisibility();
    if (needToUpdateZIndex) this.updateZIndex();
  }

  private updateView(): void {
    this.updatePosition();
    this.updateVisibility();
    this.updateZIndex();
  }

  private attachEventHandlers(): void {
    this.el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.broadcast({ view: this, event });
    });
    this.el.ondragstart = null;
  }

  private updateVisibility(): void {
    const { visible } = this.options;

    if (visible) {
      this.el.classList.remove(THUMB_HIDDEN);
    } else {
      this.el.classList.add(THUMB_HIDDEN);
    }
  }

  private updatePosition(): void {
    const { position } = this.options;

    this.el.style.left = `${position}%`;
  }

  private updateZIndex(): void {
    const { isHigher } = this.options;

    if (isHigher) {
      this.el.classList.add(THUMB_HIGHER);
    } else {
      this.el.classList.remove(THUMB_HIGHER);
    }
  }
}

export default Thumb;
