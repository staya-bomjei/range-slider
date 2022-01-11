import { ViewOptions } from './types';
import View from './View';

describe('View class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const view = new View(el);
  const newOptions: ViewOptions = {
    isVertical: true,
    progress: { from: 10, to: 20, visible: true },
    scale: {
      min: 0,
      max: 10,
      step: 1,
      visible: true,
      partsCounter: 5,
    },
    leftThumb: {
      position: 10,
      visible: true,
      isHigher: false,
    },
    leftTooltip: { text: 'test', visible: true },
    rightThumb: {
      position: 10,
      visible: true,
      isHigher: false,
    },
    rightTooltip: { text: 'test', visible: true },
  };

  test('Can set and get options', () => {
    view.setOptions(newOptions);
    expect(view.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    view.setOptions({ isVertical: false });
    expect(view.getOptions()).toMatchObject({ ...newOptions, isVertical: false });
  });

  test('It handles pointerdown events', () => {
    const {
      track: { el: trackEl },
      scale,
      leftThumb: { el: leftThumbEl },
      rightThumb: { el: rightThumbEl },
    } = view.subViews;
    jest.spyOn(view, 'broadcast');

    trackEl.dispatchEvent(new MouseEvent('pointerdown'));
    leftThumbEl.dispatchEvent(new MouseEvent('pointerdown'));
    rightThumbEl.dispatchEvent(new MouseEvent('pointerdown'));
    scale.items.forEach(({ el: scaleItemEl }) => {
      scaleItemEl.dispatchEvent(new MouseEvent('pointerdown'));
    });

    expect(view.broadcast).toBeCalledTimes(3 + scale.items.length);
  });
});
