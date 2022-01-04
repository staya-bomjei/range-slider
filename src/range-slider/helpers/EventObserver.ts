export default class EventObserver<D extends Object> {
  // Это объявление класса, поэтому переменная не используется
  // eslint-disable-next-line no-unused-vars
  private observers: Array<(data: D) => void>;

  constructor() {
    this.observers = [];
  }

  // eslint-disable-next-line no-unused-vars
  public subscribe(callback: (data: D) => void): void {
    this.observers.push(callback);
  }

  // eslint-disable-next-line no-unused-vars
  public unsubscribe(callback: (data: D) => void): void {
    this.observers = this.observers.filter((subscriber) => subscriber !== callback);
  }

  public broadcast(data: D): void {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}
