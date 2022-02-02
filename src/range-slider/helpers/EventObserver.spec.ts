import EventObserver from './EventObserver';

describe('EventObserver class', () => {
  const SUBSCRIBERS_COUNTER = 10;
  let observer: EventObserver<{ data: number }>;
  let subscribers: Array<jest.Mock>;

  beforeEach(() => {
    observer = new EventObserver();
    subscribers = [...Array(SUBSCRIBERS_COUNTER)].map(() => {
      const subscriber = jest.fn();
      observer.subscribe(subscriber);
      return subscriber;
    });
  });

  test('It triggers subscribers', () => {
    const data = { data: 120 };

    observer.broadcast(data);

    subscribers.forEach((subscriber) => {
      expect(subscriber).toHaveBeenCalled();
    });
  });

  test('It broadcasts data to subscribers', () => {
    const data = { data: 120 };

    observer.broadcast(data);

    subscribers.forEach((subscriber) => {
      expect(subscriber).toHaveBeenCalledWith(data);
    });
  });

  test('It doesn\'t trigger unsubscribed subscribers', () => {
    const [firstSubscriber, secondSubscriber] = subscribers;
    const firstData = { data: 120 };
    const secondData = { data: 1337 };

    const hasNoSubscriber = firstSubscriber === undefined || secondSubscriber === undefined;
    if (hasNoSubscriber) {
      throw new Error('subscribers must have at least two functions');
    }

    observer.broadcast(firstData);
    expect(firstSubscriber).toHaveBeenCalledWith(firstData);
    expect(secondSubscriber).toHaveBeenCalledWith(firstData);

    observer.unsubscribe(firstSubscriber);
    observer.broadcast(secondData);
    expect(firstSubscriber).toBeCalledTimes(1);
    expect(secondSubscriber).toHaveBeenCalledWith(secondData);
  });
});
