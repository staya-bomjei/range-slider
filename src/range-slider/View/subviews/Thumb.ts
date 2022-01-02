import EventObserver from '../../helpers/EventObserver';
import { callFunctionsForNewOptions } from '../../helpers/utils';
import { THUMB, THUMB_HIDDEN } from '../const';
import {
  IView,
  EventCallback,
  ThumbOptions,
  ViewEvent,
} from '../types';
import Tooltip from './Tooltip';

export default class Thumb extends EventObserver<EventCallback, ViewEvent> implements IView {
  tooltip = {} as Tooltip;

  readonly el: HTMLElement;

  private options = {} as ThumbOptions;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.render();
    this.attachEventHandlers();
  }

  getOptions(): ThumbOptions {
    return this.options;
  }

  setOptions(options: Partial<ThumbOptions>): void {
    const originalOptions = this.options;
    this.options = { ...originalOptions, ...options };
    callFunctionsForNewOptions(originalOptions, options, [
      {
        dependencies: ['position'],
        callback: () => this.updatePosition(),
      },
      {
        dependencies: ['visible'],
        callback: () => this.updateVisibility(),
      },
    ]);
  }

  render(): void {
    this.el.classList.add(THUMB);
    this.renderTooltip();
  }

  private renderTooltip(): void {
    this.el.innerHTML = '<div><div>';
    const [tooltipEl] = this.el.children;

    this.tooltip = new Tooltip(tooltipEl as HTMLElement);
  }

  private attachEventHandlers(): void {
    this.el.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.el.ondragstart = null;
  }

  private handleMouseDown(event: MouseEvent): void {
    this.broadcast({ view: this, event });
  }

  private updateVisibility(): void {
    const { visible } = this.options;

    if (visible) {
      this.el.classList.remove(THUMB_HIDDEN);
    } else {
      this.el.classList.add(THUMB_HIDDEN);
    }
  }

  private updatePosition(): void {
    const { position } = this.options;

    this.el.style.left = `${position}%`;
  }
}
