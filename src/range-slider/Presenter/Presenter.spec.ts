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
});
