export default class EventObserver<D extends Record<string, unknown>> {
  private observers: Array<(data: D) => void>;

  constructor() {
    this.observers = [];
  }

  public subscribe(callback: (data: D) => void): void {
    this.observers.push(callback);
  }

  public unsubscribe(callback: (data: D) => void): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== callback);
  }

  public broadcast(data: D): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}
