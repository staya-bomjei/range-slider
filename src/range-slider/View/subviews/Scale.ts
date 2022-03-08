import EventObserver from '../../helpers/EventObserver';
import { StateDependencies } from '../../helpers/types';
import { getChangedOptions, updateState } from '../../helpers/utils';
import { ScaleItemOptions, ScaleOptions, ViewEvent } from '../types';
import { SCALE_HIDDEN } from '../const';
import ScaleItem from './ScaleItem';

class Scale extends EventObserver<ViewEvent> {
  readonly items: Array<ScaleItem> = [];

  readonly el: HTMLElement;

  private options: ScaleOptions;

  private stateDependencies: StateDependencies<ScaleOptions> = [
    {
      dependencies: ['items'],
      setState: () => this.updateItems(),
    },
    {
      dependencies: ['visible'],
      setState: () => this.updateVisibility(),
    },
  ];

  constructor(el: HTMLElement, options: ScaleOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.update();
  }

  getOptions(): ScaleOptions {
    return { ...this.options };
  }

  setOptions(newOptions: Partial<ScaleOptions>): void {
    const changedOptions = getChangedOptions(this.options, newOptions);
    this.options = { ...this.options, ...changedOptions };
    this.update(changedOptions);
  }

  private update(options?: Partial<ScaleOptions>): void {
    if (!options) {
      this.updateItems();
      this.updateVisibility();
    } else {
      updateState(options, this.stateDependencies);
    }
  }

  private updateVisibility(): void {
    const { visible } = this.options;

    if (visible) {
      this.el.classList.remove(SCALE_HIDDEN);
    } else {
      this.el.classList.add(SCALE_HIDDEN);
    }
  }

  private updateItems(): void {
    const { items } = this.options;

    items.forEach((options, index) => {
      const current = this.items[index];

      if (current !== undefined) {
        current.setOptions(options);
      } else {
        this.pushItem(options);
      }
    });

    this.deleteItems(items.length);
  }

  private pushItem(options: ScaleItemOptions): void {
    const itemEl = document.createElement('div');
    const item = new ScaleItem(itemEl, options);
    item.subscribe((event) => this.broadcast(event));
    this.el.append(itemEl);
    this.items.push(item);
  }

  private deleteItems(start: number): void {
    const { items } = this;

    if (start >= items.length) return;

    items
      .splice(start)
      .forEach((item) => item.el.remove());
  }
}

export default Scale;
