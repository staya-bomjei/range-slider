import EventObserver from '../../helpers/EventObserver';
import { StateDependencies } from '../../helpers/types';
import { getChangedOptions, updateState } from '../../helpers/utils';
import { THUMB_HIDDEN, THUMB_HIGHER } from '../const';
import { ThumbOptions, ViewEvent } from '../types';

class Thumb extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  private options: ThumbOptions;

  private stateDependencies: StateDependencies<ThumbOptions> = [
    {
      dependencies: ['position'],
      setState: () => this.updatePosition(),
    },
    {
      dependencies: ['visible'],
      setState: () => this.updateVisibility(),
    },
    {
      dependencies: ['isHigher'],
      setState: () => this.updateZIndex(),
    },
  ];

  constructor(el: HTMLElement, options: ThumbOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.update();
    this.attachEventHandlers();
  }

  getOptions(): ThumbOptions {
    return { ...this.options };
  }

  setOptions(newOptions: Partial<ThumbOptions>): void {
    const changedOptions = getChangedOptions(this.options, newOptions);
    this.options = { ...this.options, ...changedOptions };
    this.update(changedOptions);
  }

  private attachEventHandlers(): void {
    this.el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.broadcast({ view: this, event });
    });
    this.el.ondragstart = null;
  }

  private update(options?: Partial<ThumbOptions>): void {
    if (!options) {
      this.updatePosition();
      this.updateVisibility();
      this.updateZIndex();
    } else {
      updateState(options, this.stateDependencies);
    }
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
