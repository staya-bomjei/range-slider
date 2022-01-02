import {
  valueToPercent,
  isDifference,
  calcNearestStepValue,
} from '../helpers/utils';
import Model from '../Model/Model';
import { ModelOptions } from '../Model/types';
import View from '../View/View';
import { THUMB_DRAGGED } from '../View/const';
import {
  ViewOptions,
  ViewEvent,
} from '../View/types';
import Thumb from '../View/subviews/Thumb';
import ScaleItem from '../View/subviews/ScaleItem';
import Track from '../View/subviews/Track';

export default class Presenter {
  private model: Model;

  private view: View;

  constructor(el: HTMLElement) {
    this.model = new Model();
    this.view = new View(el);
    const oldViewOptions = this.view.getOptions();
    const modelOptions = this.model.getOptions();
    const viewOptions = Presenter.convertToViewOptions(oldViewOptions, modelOptions);
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
    console.log('Model is change!');
    const oldViewOptions = this.view.getOptions();
    const newViewOptions = Presenter.convertToViewOptions(oldViewOptions, options);
    this.view.setOptions(newViewOptions);
  }

  private handleViewChange({ view, event }: ViewEvent): void {
    if (view instanceof Thumb) {
      this.handleThumbChange(view, event);
    } else if (view instanceof ScaleItem) {
      this.handleScaleItemMouseDown(view);
    } else if (view instanceof Track) {
      this.handleTrackMouseDown(view, event);
    }
  }

  private handleThumbChange(thumb: Thumb, event: MouseEvent): void {
    const { leftThumb, rightThumb } = this.view.subViews;
    const isLeftThumb = thumb === leftThumb;
    const leftPosition = leftThumb.getOptions().position;
    const rightPosition = rightThumb.getOptions().position;
    const constraint = (isLeftThumb) ? rightPosition : leftPosition;

    this.handleThumbMouseDown(thumb, isLeftThumb, constraint, event);
  }

  private handleScaleItemMouseDown(scaleItem: ScaleItem) {
    const { position } = scaleItem.getOptions();
    const { leftThumb, rightThumb } = this.view.subViews;
    const leftPosition = leftThumb.getOptions().position;
    const rightPosition = rightThumb.getOptions().position;
    const leftRange = Math.abs(position - leftPosition);
    const rightRange = Math.abs(position - rightPosition);
    const isLeftThumbCloser = leftRange < rightRange;

    const modelProperty = (isLeftThumbCloser) ? 'valueFrom' : 'valueTo';
    this.model.setOptions({ [modelProperty]: this.percentToValue(position) });
  }

  private handleTrackMouseDown(track: Track, event: MouseEvent) {
    console.log(track, event, this);
  }

  private handleThumbMouseDown(
    thumb: Thumb,
    isLeftThumb: boolean,
    constraint: number,
    event: MouseEvent,
  ): void {
    const { showTooltipAfterDrag } = this.model.getOptions();
    const { el } = thumb;
    const { pageX } = event;

    el.classList.add(THUMB_DRAGGED);
    this.moveThumbTo(thumb, pageX, isLeftThumb, constraint);
    if (showTooltipAfterDrag) {
      thumb.tooltip.setOptions({ visible: true });
    }

    const handleMouseMove = (e: MouseEvent) => {
      this.moveThumbTo(thumb, e.pageX, isLeftThumb, constraint);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      el.classList.remove(THUMB_DRAGGED);
      if (showTooltipAfterDrag) {
        thumb.tooltip.setOptions({ visible: false });
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.onmouseup = null;
    });
  }

  private moveThumbTo(
    thumb: Thumb,
    pageX: number,
    isLeftThumb: boolean,
    constraint: number,
  ) {
    const { position: oldPosition } = thumb.getOptions();
    const newPosition = this.calcNearestPosition(pageX);

    const passesConstraint = (isLeftThumb)
      ? newPosition <= constraint : newPosition >= constraint;
    const needToUpdate = passesConstraint && newPosition !== oldPosition;

    if (needToUpdate) {
      const modelProperty = (isLeftThumb) ? 'valueFrom' : 'valueTo';
      this.model.setOptions({ [modelProperty]: this.percentToValue(newPosition) });
    }
  }

  private calcNearestPosition(pageX: number): number {
    const { min, max, step } = this.model.getOptions();
    const { track } = this.view.subViews;
    const valueMax = max - min;
    const { left: trackLeft, width: trackWidth } = track.el.getBoundingClientRect();

    const percentStep = valueToPercent(step, valueMax);
    let newPosition = pageX - trackLeft;
    newPosition = Math.min(newPosition, trackWidth);
    newPosition = Math.max(0, newPosition);
    newPosition = valueToPercent(newPosition, trackWidth);
    newPosition = calcNearestStepValue(newPosition, percentStep);

    return newPosition;
  }

  private percentToValue(percent: number) {
    const { min, max } = this.model.getOptions();
    const valueMax = max - min;

    return (percent * valueMax) / 100;
  }

  static convertToViewOptions(viewOptions: ViewOptions, modelOptions: ModelOptions): ViewOptions {
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
      showProgress,
    } = modelOptions;
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
