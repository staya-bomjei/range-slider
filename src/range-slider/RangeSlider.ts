import Model from './Model/Model';
import { ModelOptions } from './Model/types';
import Presenter from './Presenter/Presenter';

export default class RangeSlider {
  private presenter: Presenter;

  private model: Model;

  constructor(el: HTMLElement) {
    this.presenter = new Presenter(el);
    this.model = this.presenter.getModel();

    setTimeout(() => {
      this.model.setOptions({ orientation: 'horizontal' });
    }, 1000);
    setTimeout(() => {
      this.model.setOptions({ orientation: 'vertical' });
    }, 2000);
  }

  setOptions(options: ModelOptions): void {
    this.model.setOptions(options);
  }

  getOptions(): ModelOptions {
    return this.model.getOptions();
  }
}
