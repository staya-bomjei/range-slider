import {
  valueToPercent,
  calcNearestStepValue,
  rectsIntersect,
  isFirstCloser,
} from '../helpers/utils';
import Model from '../Model/Model';
import View from '../View/View';
import { THUMB_DRAGGED } from '../View/const';
import {
  ViewOptions,
  ViewEvent,
  ScaleOptions,
  ProgressOptions,
  ThumbOptions,
  TooltipOptions,
} from '../View/types';
import Thumb from '../View/subviews/Thumb';
import Track from '../View/subviews/Track';
import ScaleItem from '../View/subviews/ScaleItem';
import { MAX_POSITION, MIN_POSITION } from './const';

class Presenter {
  model: Model;

  view: View;

  private thumbDragged: 'left' | 'right' | false;

  constructor(el: HTMLElement) {
    this.model = new Model();
    const viewOptions = this.calcViewOptions();
    this.view = new View(el, viewOptions);
    this.thumbDragged = false;

    //  Такой вызов необходим, т.к. View при инициализации рендерит свои subViews
    //  через innerHTML, что означает, что функция проверки пересечения подсказок
    //  получит DOMRect подсказок до рендеринга в браузере, поэтому далее я делаю
    //  вызов метода асинхронным, чтобы он вызвался сразу же, как только будет
    //  произведён рендеринг браузером
    setTimeout(() => this.handleTooltipsOverlap(), 0);
    this.attachEventHandlers();
  }

  private attachEventHandlers(): void {
    this.model.subscribe(() => this.handleModelChange());
    this.view.subscribe((options) => this.handleViewChange(options));
  }

  private handleModelChange(): void {
    const newViewOptions = this.calcViewOptions();
    this.view.setOptions(newViewOptions);
    this.handleTooltipsOverlap();
  }

  private handleViewChange({ view, event }: ViewEvent): void {
    if (view instanceof Thumb) {
      this.handleThumbPointerDown(view, event);
    } else if (view instanceof ScaleItem) {
      this.handleScaleItemPointerDown(view);
    } else if (view instanceof Track) {
      this.handleTrackPointerDown(event);
    } else {
      throw new Error(`Unknown view event: ${view} ${event}`);
    }
  }

  private handleScaleItemPointerDown(scaleItem: ScaleItem) {
    const { position } = scaleItem.getOptions();
    const { isRange } = this.model.getOptions();
    const { leftThumb, rightThumb } = this.view.subViews;
    const leftPosition = leftThumb.getOptions().position;
    const rightPosition = rightThumb.getOptions().position;
    const isLeftThumbCloser = !isRange
      || isFirstCloser(position, leftPosition, rightPosition)
      || position < leftPosition;

    const modelProperty = (isLeftThumbCloser) ? 'valueFrom' : 'valueTo';
    this.model.setOptions({ [modelProperty]: this.percentToValue(position) });
  }

  public handleTrackPointerDown(event: MouseEvent) {
    const { isRange } = this.model.getOptions();
    const { isVertical } = this.view.getOptions();
    const { leftThumb, rightThumb } = this.view.subViews;
    const { el: leftThumbEl } = leftThumb;
    const { el: rightThumbEl } = rightThumb;
    const leftThumbRect = leftThumbEl.getBoundingClientRect();
    const rightThumbRect = rightThumbEl.getBoundingClientRect();
    const leftThumbCoord = (isVertical) ? leftThumbRect.y : leftThumbRect.x;
    const rightThumbCoord = (isVertical) ? rightThumbRect.y : rightThumbRect.x;
    const pageCoord = (isVertical) ? event.clientY : event.clientX;

    const isLeftThumbCloser = !isRange
      || isFirstCloser(pageCoord, leftThumbCoord, rightThumbCoord)
      || leftThumbCoord > pageCoord;
    const thumb = (isLeftThumbCloser) ? leftThumb : rightThumb;

    this.handleThumbPointerDown(thumb, event);
  }

  private handleTooltipsOverlap(): void {
    const { isRange, valueFrom, valueTo } = this.model.getOptions();
    const needToHandle = isRange
      && this.isTooltipsOverlap()
      && valueFrom !== valueTo;

    if (!needToHandle) return;

    const originalLeftText = this.calcTooltipText(true);
    const originalRightText = this.calcTooltipText(false);
    const valuesRange = `${originalLeftText} — ${originalRightText}`;
    const leftTooltipText = (this.thumbDragged !== 'right') ? valuesRange : '';
    const rightTooltipText = (this.thumbDragged !== 'right') ? '' : valuesRange;

    const { leftTooltip, rightTooltip } = this.view.subViews;
    this.view.setOptions({
      leftTooltip: { ...leftTooltip.getOptions(), text: leftTooltipText },
      rightTooltip: { ...rightTooltip.getOptions(), text: rightTooltipText },
    });
  }

  private handleThumbPointerDown(thumb: Thumb, event: MouseEvent): void {
    const { leftThumb } = this.view.subViews;
    const isLeftThumb = thumb === leftThumb;
    const { el } = thumb;

    this.thumbDragged = (isLeftThumb) ? 'left' : 'right';
    el.classList.add(THUMB_DRAGGED);
    this.moveThumbTo(thumb, event);

    const handlePointerMove = (e: MouseEvent) => {
      this.moveThumbTo(thumb, e);
    };

    const handlePointerUp = () => {
      this.thumbDragged = false;
      el.classList.remove(THUMB_DRAGGED);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }

  private moveThumbTo(thumb: Thumb, event: MouseEvent): void {
    const { isRange } = this.model.getOptions();
    const { leftThumb, rightThumb } = this.view.subViews;
    const isLeftThumb = thumb === leftThumb;
    const { position: leftThumbPosition } = leftThumb.getOptions();
    const { position: rightThumbPosition } = rightThumb.getOptions();
    const oldPosition = (isLeftThumb) ? leftThumbPosition : rightThumbPosition;
    const constraint = (isLeftThumb) ? rightThumbPosition : leftThumbPosition;
    let newPosition = this.calcNearestPosition(event);

    const needToSetConstraint = ((isLeftThumb && newPosition > constraint)
      || (!isLeftThumb && newPosition < constraint))
      && oldPosition !== constraint;
    if (needToSetConstraint) newPosition = constraint;

    const passesConstraint = needToSetConstraint
      || (isLeftThumb) ? newPosition <= constraint : newPosition >= constraint;
    const needToUpdate = (!isRange || passesConstraint) && newPosition !== oldPosition;
    if (needToUpdate) {
      const modelProperty = (isLeftThumb) ? 'valueFrom' : 'valueTo';
      const newValue = this.percentToValue(newPosition);
      this.model.setOptions({ [modelProperty]: newValue });
    }
  }

  private calcTooltipText(isLeft: boolean): string {
    const { valueFrom, valueTo, strings } = this.model.getOptions();

    const isValueFrom = isLeft && strings === undefined;
    if (isValueFrom) {
      return String(valueFrom);
    }

    const isStringsValueFrom = isLeft && strings !== undefined;
    if (isStringsValueFrom) {
      const string = strings[valueFrom];
      if (string !== undefined) return string;

      throw new Error(`strings(${strings}) must have string item with index ${valueFrom}`);
    }

    if (valueTo === undefined) {
      return '';
    }

    if (strings === undefined) {
      return String(valueTo);
    }

    const string = strings[valueTo];
    if (string !== undefined) return string;

    throw new Error(`strings(${strings}) must have string item with index ${valueTo}`);
  }

  private calcNearestPosition(event: MouseEvent): number {
    const { min, max, step } = this.model.getOptions();
    const { isVertical } = this.view.getOptions();
    const { track } = this.view.subViews;
    const trackRect = track.el.getBoundingClientRect();
    const pageCoord = (isVertical) ? event.clientY : event.clientX;
    const trackOffset = (isVertical) ? trackRect.top : trackRect.left;
    const trackLength = (isVertical) ? trackRect.height : trackRect.width;

    const percentStep = valueToPercent(step, max - min);
    let nearestPosition = valueToPercent(pageCoord - trackOffset, trackLength);
    nearestPosition = Math.max(nearestPosition, MIN_POSITION);
    const mayNearest = calcNearestStepValue(nearestPosition, percentStep, MIN_POSITION);
    const isMaxNearest = isFirstCloser(nearestPosition, MAX_POSITION, mayNearest);

    return (isMaxNearest) ? MAX_POSITION : mayNearest;
  }

  private percentToValue(percent: number) {
    const { min, max, step } = this.model.getOptions();
    const value = (percent * (max - min)) / MAX_POSITION + min;

    return (value >= max) ? max : calcNearestStepValue(value, step, min);
  }

  private isTooltipsOverlap(): boolean {
    const {
      leftTooltip: {
        el: leftTooltipEl,
      },
      rightTooltip: {
        el: rightTooltipEl,
      },
    } = this.view.subViews;
    const leftTooltipRect = leftTooltipEl.getBoundingClientRect();
    const rightTooltipRect = rightTooltipEl.getBoundingClientRect();
    return rectsIntersect(leftTooltipRect, rightTooltipRect);
  }

  private calcViewOptions(): ViewOptions {
    return {
      isVertical: this.calcIsVertical(),
      scale: this.calcScaleOptions(),
      progress: this.calcProgressOptions(),
      leftThumb: this.calcThumbOptions(true),
      rightThumb: this.calcThumbOptions(false),
      leftTooltip: this.calcTooltipOptions(true),
      rightTooltip: this.calcTooltipOptions(false),
    };
  }

  private calcIsVertical(): boolean {
    const { orientation } = this.model.getOptions();

    return orientation === 'vertical';
  }

  private calcScaleOptions(): ScaleOptions {
    const {
      min,
      max,
      step,
      scaleParts,
      showScale,
      strings,
    } = this.model.getOptions();

    const scaleOptions: ScaleOptions = {
      min,
      max,
      step,
      partsCounter: scaleParts,
      visible: showScale,
    };
    if (strings !== undefined) scaleOptions.strings = strings;

    return scaleOptions;
  }

  private calcProgressOptions(): ProgressOptions {
    const {
      min,
      max,
      valueFrom,
      valueTo,
      showProgress,
    } = this.model.getOptions();

    const isRange = valueTo !== undefined;
    const minMaxRange = max - min;
    const percentFrom = valueToPercent(valueFrom - min, minMaxRange);
    const percentTo = isRange
      ? valueToPercent(valueTo - min, minMaxRange)
      : MIN_POSITION;

    return {
      from: (isRange) ? percentFrom : percentTo,
      to: (isRange) ? percentTo : percentFrom,
      visible: showProgress,
    };
  }

  calcThumbOptions(isLeft: boolean): ThumbOptions {
    const {
      min,
      max,
      valueFrom,
      valueTo,
      isRange,
    } = this.model.getOptions();

    const minMaxRange = max - min;
    let position: number;
    if (isLeft) {
      position = valueToPercent(valueFrom - min, minMaxRange);
    } else {
      position = (valueTo !== undefined)
        ? valueToPercent(valueTo - min, minMaxRange)
        : MAX_POSITION;
    }
    const needToSetZIndexes = valueFrom === valueTo;
    const isLeftThumbHigher = needToSetZIndexes && valueFrom === max;
    const isRightThumbHigher = needToSetZIndexes && valueTo === min;

    return {
      position,
      visible: (isLeft) ? true : isRange,
      isHigher: (isLeft) ? isLeftThumbHigher : isRightThumbHigher,
    };
  }

  calcTooltipOptions(isLeft: boolean): TooltipOptions {
    const { showTooltip } = this.model.getOptions();

    return {
      text: this.calcTooltipText(isLeft),
      visible: showTooltip,
    };
  }
}

export default Presenter;
