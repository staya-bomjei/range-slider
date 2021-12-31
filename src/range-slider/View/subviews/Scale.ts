import { calcNearestStepValue } from '../../helpers/utils';
import defaultOptions from '../../Options/default';
import IView from '../interface';
import { SCALE, SCALE_HIDDEN } from '../const';
import { ScaleOptions } from './types';
import ScaleItem from './ScaleItem';

export default class Scale implements IView {
  readonly el: HTMLElement;

  private options: ScaleOptions;

  private items: Array<ScaleItem>;

  constructor(el: HTMLElement) {
    this.items = [];
    this.el = el;
    this.render();

    this.options = {} as ScaleOptions;
    this.setOptions(defaultOptions as ScaleOptions);
  }

  public setOptions(options: ScaleOptions) {
    const { strings } = options;

    if (strings !== undefined) {
      this.options = {
        ...this.options,
        ...options,
        min: 0,
        max: strings.length - 1,
        step: 1,
        strings,
      };
    } else {
      this.options = { ...this.options, ...options };
      delete this.options.strings;
    }

    this.updateView();
  }

  public render(isPrerender: boolean = true): void {
    if (isPrerender) {
      this.el.classList.add(SCALE);
    } else {
      const partHTML = '<div></div>';
      const { scaleParts } = this.options;
      this.el.innerHTML = partHTML.repeat(scaleParts + 1);

      this.items = [];
      Array.from(this.el.children).forEach((el) => {
        this.items.push(new ScaleItem(el as HTMLElement));
      });
    }
  }

  private updateView(): void {
    const { showScale } = this.options;
    this.setVisibility(showScale);
    this.updateItems();
  }

  private setVisibility(visible: boolean): void {
    if (visible) {
      this.el.classList.remove(SCALE_HIDDEN);
    } else {
      this.el.classList.add(SCALE_HIDDEN);
    }
  }

  private updateItems(): void {
    this.render(false);

    const correctValues = this.calcCorrectValues();
    const correctPositions = this.calcCorrectPositions(correctValues);
    const correctTexts = this.calcCorrectTexts(correctValues);

    // correctValues, correctPositions, correctTexts, this.items всегда имеют одинаковую длину,
    // т.к. их длинна всегда равна this.options.scaleParts + 1

    this.items.forEach((item, index) => {
      item.setPosition(correctPositions[index]!);
      item.setText(correctTexts[index]!);
    });
  }

  private calcCorrectValues(): Array<number> {
    const correctValues: Array<number> = [];
    const {
      min,
      max,
      step,
      scaleParts,
    } = this.options;

    const valuePerPart = (max - min) / scaleParts;
    for (let i = 0; i < scaleParts; i += 1) {
      const value = valuePerPart * i;
      const nearestCorrectValue = calcNearestStepValue(value, step);
      correctValues.push(nearestCorrectValue + min);
    }
    correctValues.push(max);

    return correctValues;
  }

  private calcCorrectPositions(correctValues: Array<number>): Array<number> {
    const { min, max } = this.options;
    return correctValues
      .map((value) => ((value - min) / (max - min)) * 100);
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
