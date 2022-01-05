import EventObserver from './EventObserver';

describe('EventObserver class', () => {
  test('It broadcasts data to subscribers', () => {
    const observer = new EventObserver<{ data: number }>();
    const subscribers = [...Array(10)];

    subscribers.forEach((_, index) => {
      subscribers[index] = jest.fn();
      observer.subscribe(subscribers[index]);
    });
    const data = { data: 120 };

    observer.broadcast(data);

    subscribers.forEach((subscriber) => {
      expect(subscriber).toHaveBeenCalledWith(data);
    });
  });
  test('It can unsubscribe', () => {
    const observer = new EventObserver<{ data: number }>();
    const firstSubscriber = jest.fn();
    const secondSubscriber = jest.fn();
    const firstData = { data: 120 };

    observer.subscribe(firstSubscriber);
    observer.subscribe(secondSubscriber);
    observer.broadcast(firstData);

    expect(firstSubscriber).toHaveBeenCalledWith(firstData);
    expect(secondSubscriber).toHaveBeenCalledWith(firstData);

    const secondData = { data: 1337 };
    observer.unsubscribe(firstSubscriber);
    observer.broadcast(secondData);

    expect(firstSubscriber).toBeCalledTimes(1);
    expect(secondSubscriber).toHaveBeenCalledWith(secondData);
  });
});
