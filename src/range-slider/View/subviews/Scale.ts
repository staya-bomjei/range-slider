import { calcNearestStepValue, callFunctionsForNewOptions, valueToPercent } from '../../helpers/utils';
import { IView, ScaleOptions } from '../types';
import { SCALE, SCALE_HIDDEN } from '../const';
import ScaleItem from './ScaleItem';

export default class Scale implements IView {
  items = [] as Array<ScaleItem>;

  readonly el: HTMLElement;

  private options = {} as ScaleOptions;

  constructor(el: HTMLElement) {
    this.el = el;
    this.render();
  }

  getOptions(): ScaleOptions {
    return { ...this.options };
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

  render(): void {
    this.el.classList.add(SCALE);
    this.renderItems();
  }

  private renderItems(): void {
    const { partsCounter } = this.options;
    this.el.innerHTML = '<div></div>'.repeat(partsCounter + 1);

    this.items = [];
    Array.from(this.el.children).forEach((el) => {
      this.items.push(new ScaleItem(el as HTMLElement));
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

    const correctValues = this.calcCorrectValues();
    const correctPositions = this.calcCorrectPositions(correctValues);
    const correctTexts = this.calcCorrectTexts(correctValues);

    // correctValues, correctPositions, correctTexts, this.items всегда имеют одинаковую длину,
    // т.к. их длинна всегда равна this.options.scaleParts + 1

    this.items.forEach((item, index) => {
      item.setOptions({
        position: correctPositions[index]!,
        text: correctTexts[index]!,
      });
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
      const value = valuePerPart * index;
      const nearestCorrectValue = calcNearestStepValue(value, step);
      correctValues[index] = nearestCorrectValue + min;
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
      if (strings !== undefined) {
        return strings[value]!;
      }
      return String(value);
    });
  }
}
