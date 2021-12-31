import AutoBind from '../helpers/AutoBind';
import Model from '../Model/Model';
import View from '../View/View';
import { Options } from '../Options/types';

export default class Presenter {
  private model: Model;

  private view: View;

  constructor(el: HTMLElement) {
    this.model = new Model();
    this.view = new View(el);

    this.attachEventHandlers();
  }

  public getModel(): Model {
    return this.model;
  }

  private attachEventHandlers(): void {
    this.model.onChange(this.handleModelChange);
    this.view.onChange(this.handleViewChange);
  }

  @AutoBind
  private handleModelChange(data: Options): void {
    // Обновить this.view
    console.log(data);
  }

  @AutoBind
  private handleViewChange(data: Options): void {
    // Обновить this.model
    console.log(data);
  }
}
