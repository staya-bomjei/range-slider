import EventObserver from '../../helpers/EventObserver';
import { callFunctionsForNewOptions } from '../../helpers/utils';
import { THUMB_HIDDEN, THUMB_HIGHER } from '../const';
import { ThumbOptions, ViewEvent } from '../types';

export default class Thumb extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  private options = {} as ThumbOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.attachEventHandlers();
  }

  getOptions(): ThumbOptions {
    return this.options;
  }

  setOptions(options: Partial<ThumbOptions>): void {
    const originalOptions = this.options;
    this.options = { ...originalOptions, ...options };
    callFunctionsForNewOptions(originalOptions, options, [
      {
        dependencies: ['position'],
        callback: () => this.updatePosition(),
      },
      {
        dependencies: ['visible'],
        callback: () => this.updateVisibility(),
      },
      {
        dependencies: ['isHigher'],
        callback: () => this.updateZIndex(),
      },
    ]);
  }

  private attachEventHandlers(): void {
    this.el.addEventListener('pointerdown', (event) => {
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
