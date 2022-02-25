import EventObserver from '../../helpers/EventObserver';
import { StateDependencies } from '../../helpers/types';
import { getChangedOptions, updateState } from '../../helpers/utils';
import { ScaleItemOptions, ViewEvent } from '../types';
import { SCALE_ITEM } from '../const';

class ScaleItem extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  private options: ScaleItemOptions;

  private stateDependencies: StateDependencies<ScaleItemOptions> = [
    {
      dependencies: ['position'],
      setState: () => this.updatePosition(),
    },
    {
      dependencies: ['text'],
      setState: () => this.updateText(),
    },
  ];

  constructor(el: HTMLElement, options: ScaleItemOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.render();
    this.update();
    this.attachEventHandlers();
  }

  getOptions(): ScaleItemOptions {
    return { ...this.options };
  }

  setOptions(newOptions: Partial<ScaleItemOptions>): void {
    const changedOptions = getChangedOptions(this.options, newOptions);
    this.options = { ...this.options, ...changedOptions };
    this.update(changedOptions);
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

  private update(options?: Partial<ScaleItemOptions>): void {
    if (!options) {
      this.updatePosition();
      this.updateText();
    } else {
      updateState(options, this.stateDependencies);
    }
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
