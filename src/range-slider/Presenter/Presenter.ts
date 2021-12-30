import AutoBind from '../helpers/AutoBind';
import Model from '../Model/Model';
import { ModelOptions } from '../Model/types';
import { ViewOptions } from '../View/types';
import View from '../View/View';

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
  private handleModelChange(data: ModelOptions): void {
    // Обновить this.view
    console.log(data);
  }

  @AutoBind
  private handleViewChange(data: ViewOptions): void {
    // Обновить this.model
    console.log(data);
  }
}
