export default class EventObserver<C extends Function, D extends Object> {
  private observers: Array<C>;

  constructor() {
    this.observers = [];
  }

  public subscribe(callback: C) {
    this.observers.push(callback);
  }

  public unsubscribe(callback: C) {
    this.observers = this.observers.filter((subscriber) => subscriber !== callback);
  }

  public broadcast(data: D) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}
