import EventObserver from '../../helpers/EventObserver';
import { calcNearestStepValue, valueToPercent } from '../../helpers/utils';
import { ScaleOptions, ViewEvent } from '../types';
import { SCALE_HIDDEN } from '../const';
import ScaleItem from './ScaleItem';

class Scale extends EventObserver<ViewEvent> {
  items: Array<ScaleItem> = [];

  readonly el: HTMLElement;

  private options: ScaleOptions;

  constructor(el: HTMLElement, options: ScaleOptions) {
    super();

    this.el = el;
    this.options = { ...options };
    this.updateView();
  }

  getOptions(): ScaleOptions {
    return { ...this.options };
  }

  setOptions(options: Partial<ScaleOptions>): void {
    const {
      min,
      max,
      step,
      partsCounter,
      strings,
      visible,
    } = options;
    const needToUpdateItems = (min !== undefined && min !== this.options.min)
      || (max !== undefined && max !== this.options.max)
      || (step !== undefined && step !== this.options.step)
      || (partsCounter !== undefined && partsCounter !== this.options.partsCounter)
      || (strings !== undefined && strings !== this.options.strings);
    const needToUpdateVisibility = visible !== undefined && visible !== this.options.visible;
    this.options = { ...this.options, ...options };

    if (needToUpdateItems) this.updateItems();
    if (needToUpdateVisibility) this.updateVisibility();
  }

  private updateView(): void {
    this.updateItems();
    this.updateVisibility();
  }

  private attachEventHandlers(): void {
    this.items.forEach((item) => {
      item.subscribe((event) => this.broadcast(event));
    });
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
    const {
      min,
      max,
      step,
      partsCounter,
    } = this.options;
    this.el.innerHTML = '<div></div>'.repeat(partsCounter + 1);
    this.items = [];
    const valuePerPart = (max - min) / partsCounter;
    let prevValue: number | undefined;

    Array.from(this.el.children).forEach((el, index) => {
      if (!(el instanceof HTMLElement)) {
        throw new Error('cannot get HTMLElements from scale render structure');
      }

      const value = valuePerPart * index + min;
      let nearestCorrectValue = calcNearestStepValue(value, step, min);
      if (nearestCorrectValue === prevValue) {
        nearestCorrectValue += step;
      }
      prevValue = nearestCorrectValue;

      const options = {
        position: this.calcPosition(nearestCorrectValue),
        text: this.calcText(nearestCorrectValue),
      };
      this.items.push(new ScaleItem(el, options));
    });

    const lastItem = this.items[this.items.length - 1];
    if (lastItem === undefined) {
      throw Error('Items must have last item');
    }

    lastItem.setOptions({
      position: this.calcPosition(max),
      text: this.calcText(max),
    });

    this.attachEventHandlers();
  }

  private calcPosition(value: number): number {
    const { min, max } = this.options;
    return valueToPercent(value - min, max - min);
  }

  private calcText(value: number): string {
    const { strings } = this.options;
    if (strings === undefined) return String(value);

    const string = strings[value];
    if (string !== undefined) return string;

    throw new Error(`strings(${strings}) must have string item with index ${value}`);
  }
}

export default Scale;
