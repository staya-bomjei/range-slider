import EventObserver from '../../helpers/EventObserver';
import { ViewEvent } from '../types';

class Track extends EventObserver<ViewEvent> {
  private el: HTMLElement;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.attachEventHandlers();
  }

  public getEl(): HTMLElement {
    return this.el;
  }

  private attachEventHandlers() {
    this.el.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.broadcast({ view: this, event });
    });
  }
}

export default Track;
