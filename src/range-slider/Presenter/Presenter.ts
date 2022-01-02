import { valueToPercent, isDifference } from '../helpers/utils';
import Model from '../Model/Model';
import { ModelOptions } from '../Model/types';
import View from '../View/View';
import {
  ViewOptions,
  ViewEvent,
} from '../View/types';

export default class Presenter {
  private model: Model;

  private view: View;

  constructor(el: HTMLElement) {
    this.model = new Model();
    this.view = new View(el);
    const viewOptions = this.convertToViewOptions(this.model.getOptions());
    console.log(viewOptions);
    this.view.setOptions(viewOptions);

    this.attachEventHandlers();
  }

  getModel(): Model {
    return this.model;
  }

  private attachEventHandlers(): void {
    this.model.subscribe((options) => this.handleModelChange(options));
    this.view.subscribe((options) => this.handleViewChange(options));
  }

  private handleModelChange(options: ModelOptions): void {
    console.log('Model is changed:');
    console.log(options);
    const newViewOptions = this.convertToViewOptions(options);
    this.view.setOptions(newViewOptions);
  }

  private handleViewChange(options: ViewEvent): void {
    console.log('View is changed:');
    console.log(options);
    const viewOptions = this.view.getOptions();
    const newModelOptions = this.convertToModelOptions(viewOptions);
    this.model.updateOptions(newModelOptions);
  }

  private convertToModelOptions(options: ViewOptions): ModelOptions {
    const modelOptions = this.model.getOptions();
    // TODO
    console.log(options);
    return modelOptions;
  }

  private convertToViewOptions(modelOptions: ModelOptions): ViewOptions {
    const {
      min,
      max,
      step,
      strings,
      valueFrom,
      valueTo,
      isRange,
      // orientation,
      showScale,
      scaleParts,
      showTooltip,
      // showTooltipAfterDrag,
      showProgress,
      // allowThumbsSwap,
    } = modelOptions;
    const viewOptions = this.view.getOptions();
    const percentFrom = valueToPercent(valueFrom - min, max);
    const percentTo = valueToPercent(valueTo - min, max);

    const computedViewOptions = {
      progress: {
        from: percentFrom,
        to: percentTo,
        visible: showProgress,
      },
      scale: {
        min,
        max,
        step,
        strings,
        partsCounter: scaleParts,
        visible: showScale,
      },
      leftThumb: {
        position: percentFrom,
        visible: true,
      },
      rightThumb: {
        position: percentTo,
        visible: isRange,
      },
      leftTooltip: {
        text: String(valueFrom),
        visible: showTooltip,
      },
      rightTooltip: {
        text: String(valueTo),
        visible: showTooltip,
      },
    } as ViewOptions;

    const keys = Object.keys(computedViewOptions) as Array<keyof ViewOptions>;
    return keys.reduce((options, key) => {
      const originalViewHasOption = key in viewOptions;
      const isOptionSimple = typeof viewOptions[key] !== 'object';
      const needToUpdate = !originalViewHasOption
        || (isOptionSimple && viewOptions[key] !== computedViewOptions[key])
        || isDifference(viewOptions[key], computedViewOptions[key]);

      if (needToUpdate) {
        return {
          ...options,
          [key]: computedViewOptions[key],
        };
      }
      return options;
    }, viewOptions);
  }
}
