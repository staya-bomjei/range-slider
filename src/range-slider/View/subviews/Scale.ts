import EventObserver from '../../helpers/EventObserver';
import { calcNearestStepValue, callFunctionsForNewOptions, valueToPercent } from '../../helpers/utils';
import { ScaleItemOptions, ScaleOptions, ViewEvent } from '../types';
import { SCALE_HIDDEN } from '../const';
import ScaleItem from './ScaleItem';

class Scale extends EventObserver<ViewEvent> {
  items = [] as Array<ScaleItem>;

  readonly el: HTMLElement;

  private options = {} as ScaleOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
  }

  getOptions(): ScaleOptions {
    return this.options;
  }

  setOptions(options: Partial<ScaleOptions>): void {
    const originalOptions = this.options;
    this.options = { ...originalOptions, ...options };

    callFunctionsForNewOptions(originalOptions, options, [
      {
        dependencies: ['min', 'max', 'step', 'strings', 'partsCounter'],
        callback: () => this.updateItems(),
      },
      {
        dependencies: ['visible'],
        callback: () => this.updateVisibility(),
      },
    ]);
  }

  private renderItems(): void {
    const { partsCounter } = this.options;
    this.el.innerHTML = '<div></div>'.repeat(partsCounter + 1);

    this.items = [];
    Array.from(this.el.children).forEach((el) => {
      this.items.push(new ScaleItem(el as HTMLElement));
    });
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
    this.renderItems();
    this.attachEventHandlers();

    const correctValues = this.calcCorrectValues();
    const correctPositions = this.calcCorrectPositions(correctValues);
    const correctTexts = this.calcCorrectTexts(correctValues);

    this.items.forEach((item, index) => {
      const position = correctPositions[index];
      const text = correctTexts[index];
      const options: Partial<ScaleItemOptions> = {};

      if (position !== undefined) options.position = position;
      if (text !== undefined) options.text = text;

      item.setOptions(options);
    });
  }

  private calcCorrectValues(): Array<number> {
    const {
      min,
      max,
      step,
      partsCounter,
    } = this.options;
    const valuePerPart = (max - min) / partsCounter;
    const correctValues = [...Array(partsCounter)];

    correctValues.forEach((_, index) => {
      const value = valuePerPart * index + min;
      const nearestCorrectValue = calcNearestStepValue(value, step, min);
      correctValues[index] = nearestCorrectValue;
    });
    correctValues.push(max);

    return correctValues;
  }

  private calcCorrectPositions(correctValues: Array<number>): Array<number> {
    const { min, max } = this.options;
    return correctValues
      .map((value) => valueToPercent(value - min, max - min));
  }

  private calcCorrectTexts(correctValues: Array<number>): Array<string> {
    const { strings } = this.options;

    return correctValues.map((value) => {
      if (strings === undefined) return String(value);

      const string = strings[value];

      if (string !== undefined) return string;

      throw new Error(`strings(${strings}) must have string item with index ${value}`);
    });
  }
}

export default Scale;
