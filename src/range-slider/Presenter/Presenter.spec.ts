import Model from '../Model/Model';
import { SubViews } from '../View/types';
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
  let subViews: SubViews;

  beforeEach(() => {
    presenter = new Presenter(el);
    model = presenter.getModel();
    view = presenter.getView();
    subViews = view.getSubViews();
  }, 10);

  test('Correctly updates view when model changes', () => {
    const newOptions = { valueFrom: 17 };
    model.setOptions(newOptions);

    const { progress, leftThumb, leftTooltip } = view.getOptions();
    expect(progress.to).toEqual(17);
    expect(leftThumb.position).toEqual(17);
    expect(leftTooltip.text).toEqual('17');
  });

  test('Handles thumb pointerdown', () => {
    const { leftThumb } = subViews;

    expect(() => {
      leftThumb.broadcast({
        view: leftThumb,
        event: new MouseEvent('pointerdown'),
      });
    }).toThrow('valueFrom(NaN) must be a multiple of 1');
  });

  test('Handles scale item pointerdown', () => {
    const newOptions = { valueFrom: 1, scaleParts: 2 };
    model.setOptions(newOptions);

    const { scale, leftThumb } = subViews;
    const items = scale.getItems();
    const lastScaleItem = items[items.length - 1];

    if (lastScaleItem === undefined) {
      throw new Error('scale must have last item');
    }

    lastScaleItem.broadcast({
      view: lastScaleItem,
      event: new MouseEvent('pointerdown'),
    });

    const { position: leftThumbPosition } = leftThumb.getOptions();
    expect(leftThumbPosition).toEqual(100);
  });

  test('Handles track pointerdown', () => {
    const { track } = subViews;

    expect(() => {
      track.broadcast({
        view: track,
        event: new MouseEvent('pointerdown'),
      });
    }).toThrow('valueFrom(NaN) must be a multiple of 1');
  });

  test('handles tooltip overlap', () => {
    const { leftTooltip, rightTooltip } = subViews;
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
    const leftTooltipEl = leftTooltip.getEl();
    const rightTooltipEl = rightTooltip.getEl();
    leftTooltipEl.getBoundingClientRect = getRectMock;
    rightTooltipEl.getBoundingClientRect = getRectMock;

    model.setOptions({ valueFrom: 0, valueTo: 1, isRange: true });

    const { text: rightTooltipText } = rightTooltip.getOptions();
    const { text: leftTooltipText } = leftTooltip.getOptions();
    expect(rightTooltipText).toEqual('');
    expect(leftTooltipText).toEqual('0 — 1');
  });

  test('it works with strings correctly', () => {
    const newOptions = {
      valueFrom: 0,
      strings: ['один', 'два', 'три', 'четыре', 'пять'],
    };
    model.setOptions(newOptions);

    const { leftTooltip } = subViews;
    const { text: leftTooltipText } = leftTooltip.getOptions();
    expect(leftTooltipText).toEqual(newOptions.strings[newOptions.valueFrom]);
  });
});
