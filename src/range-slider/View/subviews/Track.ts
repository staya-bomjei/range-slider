import EventObserver from '../../helpers/EventObserver';
import { ViewEvent } from '../types';

class Track extends EventObserver<ViewEvent> {
  readonly el: HTMLElement;

  constructor(el: HTMLElement) {
    super();

    this.el = el;
    this.attachEventHandlers();
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
