import Model from './Model/Model';
import { Options, OptionValues } from './Options/types';
// import defaultOptions from './Options/default';
import Presenter from './Presenter/Presenter';

export default class RangeSlider {
  private presenter: Presenter;

  private model: Model;

  constructor(el: HTMLElement) {
    this.presenter = new Presenter(el);
    this.model = this.presenter.getModel();

    // this.model.setOptions({
    //   ...defaultOptions,
    //   valueFrom: 123,
    // });
  }

  public setOption(option: keyof Options, value: OptionValues): void {
    const oldOptions = { ...this.model.getOptions() };
    const newOptions = {
      ...oldOptions,
      [option]: value,
    };

    this.model.setOptions(newOptions);
  }
}
