import Model from './Model/Model';
import { ModelOptions, ModelOptionValues } from './Model/types';
import Presenter from './Presenter/Presenter';

export default class RangeSlider {
  private presenter: Presenter;

  private model: Model;

  constructor(el: HTMLElement) {
    this.presenter = new Presenter(el);
    this.model = this.presenter.getModel();
  }

  public setOption(option: keyof ModelOptions, value: ModelOptionValues): void {
    const oldOptions = { ...this.model.getOptions() };
    const newOptions = {
      ...oldOptions,
      [option]: value,
    };

    this.model.setOptions(newOptions);
  }
}
