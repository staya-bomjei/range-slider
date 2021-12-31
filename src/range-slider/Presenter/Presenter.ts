import Model from '../Model/Model';
import View from '../View/View';
import { Options } from '../Options/types';

export default class Presenter {
  private model: Model;

  private view: View;

  constructor(el: HTMLElement) {
    this.model = new Model();
    this.view = new View(el, this.model.getOptions());

    this.attachEventHandlers();
  }

  public getModel(): Model {
    return this.model;
  }

  private attachEventHandlers(): void {
    this.model.onChange((options) => this.handleModelChange(options));
    this.view.onChange((options) => this.handleViewChange(options));
  }

  private handleModelChange(options: Options): void {
    console.log('Model is changed:');
    console.log(options);
    this.view.setOptions(options);
  }

  private handleViewChange(options: Options): void {
    console.log('View is changed:');
    console.log(options);
    this.model.setOptions(options);
  }
}
