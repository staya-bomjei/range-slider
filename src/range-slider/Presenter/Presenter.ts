import {
  valueToPercent,
  calcNearestStepValue,
  callFunctionsForNewOptions,
  rectsIntersect,
  isFirstCloser,
} from '../helpers/utils';
import Model from '../Model/Model';
import { ModelOptions } from '../Model/types';
import View from '../View/View';
import { THUMB_DRAGGED } from '../View/const';
import { ViewOptions, ViewEvent, TooltipOptions } from '../View/types';
import Thumb from '../View/subviews/Thumb';
import Track from '../View/subviews/Track';
import ScaleItem from '../View/subviews/ScaleItem';

export default class Presenter {
  model: Model;

  view: View;

  private thumbDragged: 'left' | 'right' | false;

  constructor(el: HTMLElement) {
    this.model = new Model();
    this.view = new View(el);
    this.thumbDragged = false;
    const modelOptions = this.model.getOptions();
    //  Такой вызов необходим, т.к. View при инициализации рендерит свои subViews
    //  через innerHTML, что означает, что функция проверки пересечения подсказок
    //  получит DOMRect подсказок до рендеринга в браузере, поэтому далее я делаю
    //  вызов метода асинхронным, чтобы он вызвался сразу же, как только будет
    //  произведён рендеринг браузером
    setTimeout(() => this.handleModelChange(modelOptions), 0);

    this.attachEventHandlers();
  }

  private attachEventHandlers(): void {
    this.model.subscribe((options) => this.handleModelChange(options));
    this.view.subscribe((options) => this.handleViewChange(options));
  }

  private handleModelChange(newModelOptions: Partial<ModelOptions>): void {
    const newViewOptions = this.convertToViewOptions(newModelOptions);
    this.view.setOptions(newViewOptions);
    this.handleTooltipsOverlap();
  }

  private handleViewChange({ view, event }: ViewEvent): void {
    if (view instanceof Thumb) {
      this.handleThumbMouseDown(view, event);
    } else if (view instanceof ScaleItem) {
      this.handleScaleItemMouseDown(view);
    } else if (view instanceof Track) {
      this.handleTrackMouseDown(event);
    } else {
      throw new Error(`Unknown view event: ${view} ${event}`);
    }
  }

  private handleScaleItemMouseDown(scaleItem: ScaleItem) {
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

  public handleTrackMouseDown(event: MouseEvent) {
    const { isRange } = this.model.getOptions();
    const { isVertical } = this.view.getOptions();
    const { leftThumb, rightThumb } = this.view.subViews;
    const { el: leftThumbEl } = leftThumb;
    const { el: rightThumbEl } = rightThumb;
    const leftThumbRect = leftThumbEl.getBoundingClientRect();
    const rightThumbRect = rightThumbEl.getBoundingClientRect();
    const leftThumbCoord = (isVertical) ? leftThumbRect.y : leftThumbRect.x;
    const rightThumbCoord = (isVertical) ? rightThumbRect.y : rightThumbRect.x;
    const pageCoord = (isVertical) ? event.pageY : event.pageX;

    const isLeftThumbCloser = !isRange
      || isFirstCloser(pageCoord, leftThumbCoord, rightThumbCoord)
      || leftThumbCoord > pageCoord;
    const thumb = (isLeftThumbCloser) ? leftThumb : rightThumb;

    this.handleThumbMouseDown(thumb, event);
  }

  private handleTooltipsOverlap(): void {
    const { isRange, valueFrom, valueTo } = this.model.getOptions();
    const needToHandle = isRange
      && this.isTooltipsOverlap()
      && valueFrom !== valueTo;

    if (!needToHandle) return;

    const originalLeftText = this.calcTooltipText(true);
    const originalRightText = this.calcTooltipText(false);

    const valuesRange = `${originalLeftText} - ${originalRightText}`;
    const leftTooltipText = (this.thumbDragged !== 'right') ? valuesRange : '';
    const rightTooltipText = (this.thumbDragged !== 'right') ? '' : valuesRange;
    this.view.setOptions({
      leftTooltip: { text: leftTooltipText } as TooltipOptions,
      rightTooltip: { text: rightTooltipText } as TooltipOptions,
    });
  }

  private handleThumbMouseDown(thumb: Thumb, event: MouseEvent): void {
    const { leftThumb } = this.view.subViews;
    const isLeftThumb = thumb === leftThumb;
    const { el } = thumb;

    this.thumbDragged = (isLeftThumb) ? 'left' : 'right';
    el.classList.add(THUMB_DRAGGED);
    this.moveThumbTo(thumb, event);

    const handleMouseMove = (e: MouseEvent) => {
      this.moveThumbTo(thumb, e);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
      this.thumbDragged = false;
      el.classList.remove(THUMB_DRAGGED);
      document.removeEventListener('mousemove', handleMouseMove);
      document.onmouseup = null;
    });
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
      this.model.setOptions({ [modelProperty]: this.percentToValue(newPosition) });
    }
  }

  private calcTooltipText(isLeft: boolean): string {
    const { valueFrom, valueTo, strings } = this.model.getOptions();
    const value = (isLeft) ? valueFrom : valueTo;
    // использую далее '!', т.к. значения модели считаются всегда корректными
    const text = (strings === undefined) ? String(value) : strings[value]!;
    return text;
  }

  private calcNearestPosition(event: MouseEvent): number {
    const { min, max, step } = this.model.getOptions();
    const { isVertical } = this.view.getOptions();
    const { track } = this.view.subViews;
    const trackRect = track.el.getBoundingClientRect();
    const pageCoord = (isVertical) ? event.pageY : event.pageX;
    const trackOffset = (isVertical) ? trackRect.top : trackRect.left;
    const trackLength = (isVertical) ? trackRect.height : trackRect.width;

    const percentStep = valueToPercent(step, max - min);
    let nearestPosition = pageCoord - trackOffset;
    nearestPosition = Math.min(nearestPosition, trackLength);
    nearestPosition = Math.max(0, nearestPosition);
    nearestPosition = valueToPercent(nearestPosition, trackLength);
    nearestPosition = calcNearestStepValue(nearestPosition, percentStep);

    return nearestPosition;
  }

  private percentToValue(percent: number) {
    const { min, max, step } = this.model.getOptions();
    const valueMax = max - min;
    const value = (percent * valueMax) / 100;

    return calcNearestStepValue(value, step);
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

  private convertToViewOptions(newModelOptions: Partial<ModelOptions>): ViewOptions {
    const {
      min,
      max,
      step,
      strings,
      valueFrom,
      valueTo,
      isRange,
      orientation,
      showScale,
      scaleParts,
      showTooltip,
      showProgress,
    } = this.model.getOptions();
    const viewOptions = {} as ViewOptions;

    const percentStep = valueToPercent(step, max - min);
    const percentFrom = calcNearestStepValue(valueToPercent(valueFrom - min, max), percentStep);
    const percentTo = calcNearestStepValue(valueToPercent(valueTo - min, max), percentStep);
    const needToSetZIndexes = valueFrom === valueTo;
    const isLeftThumbHigher = needToSetZIndexes && valueFrom === max;
    const isRightThumbHigher = needToSetZIndexes && valueTo === min;

    // Модель уже изменила своё состояние и в эту функцию были переданы
    // лишь те её параметры, которые были изменены, поэтому далее должны
    // быть вычислены новые опции ViewOptions, которые зависят от новых
    // опций модели.
    callFunctionsForNewOptions({} as ModelOptions, newModelOptions, [
      {
        dependencies: ['orientation'],
        callback: () => {
          viewOptions.isVertical = orientation === 'vertical';
        },
      },
      {
        dependencies: ['valueFrom', 'valueTo', 'showProgress'],
        callback: () => {
          viewOptions.progress = {
            from: (isRange) ? percentFrom : 0,
            to: (isRange) ? percentTo : percentFrom,
            visible: showProgress,
          };
        },
      },
      {
        dependencies: ['min', 'max', 'step', 'strings', 'scaleParts', 'showScale'],
        callback: () => {
          viewOptions.scale = {
            min,
            max,
            step,
            strings,
            partsCounter: scaleParts,
            visible: showScale,
          };
        },
      },
      {
        dependencies: ['valueFrom', 'min', 'max'],
        callback: () => {
          viewOptions.leftThumb = {
            position: percentFrom,
            visible: true,
            isHigher: isLeftThumbHigher,
          };
        },
      },
      {
        dependencies: ['valueTo', 'min', 'max', 'isRange'],
        callback: () => {
          viewOptions.rightThumb = {
            position: percentTo,
            visible: isRange,
            isHigher: isRightThumbHigher,
          };
        },
      },
      {
        dependencies: ['valueFrom', 'valueTo', 'min', 'max', 'showTooltip'],
        callback: () => {
          viewOptions.leftTooltip = {
            text: this.calcTooltipText(true),
            visible: showTooltip,
          };
          viewOptions.rightTooltip = {
            text: this.calcTooltipText(false),
            visible: isRange && showTooltip,
          };
        },
      },
    ]);

    return viewOptions;
  }
}
