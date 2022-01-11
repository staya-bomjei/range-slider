import Model from '../Model/Model';
import View from '../View/View';
import Presenter from './Presenter';

describe('Presenter class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  let presenter: Presenter;
  let model: Model;
  let view: View;

  beforeEach(() => {
    presenter = new Presenter(el);
    model = presenter.model;
    view = presenter.view;
  }, 10);

  test('Correctly updates view when model changes', () => {
    model.setOptions({ valueFrom: 17 });
    const {
      progress,
      leftThumb,
      leftTooltip,
    } = view.getOptions();

    expect(progress.to).toEqual(17);
    expect(leftThumb.position).toEqual(17);
    expect(leftTooltip.text).toEqual('17');
  });

  test('Handles thumb pointerdown', () => {
    const { leftThumb } = view.subViews;

    expect(() => {
      leftThumb.broadcast({
        view: leftThumb,
        event: new MouseEvent('pointerdown'),
      });
    }).toThrow('valueFrom(NaN) must be a multiple of 1');
  });

  test('Handles scale item pointerdown', () => {
    model.setOptions({ valueFrom: 1, scaleParts: 2 });
    const { scale, leftThumb } = view.subViews;
    const lastScaleItem = scale.items[scale.items.length - 1];

    if (lastScaleItem === undefined) {
      throw new Error('lastScaleItem should be ScaleItem');
    }

    lastScaleItem.broadcast({
      view: lastScaleItem,
      event: new MouseEvent('pointerdown'),
    });

    const leftThumbPosition = leftThumb.getOptions().position;

    expect(leftThumbPosition).toEqual(100);
  });

  test('Handles track pointerdown', () => {
    const { track } = view.subViews;

    expect(() => {
      track.broadcast({
        view: track,
        event: new MouseEvent('pointerdown'),
      });
    }).toThrow('valueFrom(NaN) must be a multiple of 1');
  });

  test('handles tooltip overlap', () => {
    const { leftTooltip, rightTooltip } = view.subViews;
    const getRectMock = jest.fn();
    getRectMock.mockReturnValue({
      height: 100,
      width: 100,
      x: 0,
      y: 0,
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
    });
    leftTooltip.el.getBoundingClientRect = getRectMock;
    rightTooltip.el.getBoundingClientRect = getRectMock;

    model.setOptions({ valueFrom: 0, valueTo: 1, isRange: true });

    expect(rightTooltip.getOptions().text).toEqual('');
  });

  test('it works with strings correctly', () => {
    const { leftTooltip } = view.subViews;
    model.setOptions({
      valueFrom: 0,
      strings: ['один', 'два', 'три', 'четыре', 'пять'],
    });

    expect(leftTooltip.getOptions().text).toEqual('один');
  });
});
