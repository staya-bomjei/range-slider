import { ViewOptions } from './types';
import View from './View';

describe('View class:', () => {
  document.body.innerHTML = '<div><div>';
  const el = document.body.children[0] as HTMLElement;
  const view = new View(el);
  const newOptions = {
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
  } as ViewOptions;

  test('Can set and get options', () => {
    view.setOptions(newOptions);
    expect(view.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    view.setOptions({ isVertical: false });
    expect(view.getOptions()).toMatchObject({ ...newOptions, isVertical: false });
  });

  test('It handles mousedown events', () => {
    const {
      track: { el: trackEl },
      scale,
      leftThumb: { el: leftThumbEl },
      rightThumb: { el: rightThumbEl },
    } = view.subViews;
    jest.spyOn(view, 'broadcast');

    trackEl.dispatchEvent(new MouseEvent('mousedown'));
    leftThumbEl.dispatchEvent(new MouseEvent('mousedown'));
    rightThumbEl.dispatchEvent(new MouseEvent('mousedown'));
    scale.items.forEach(({ el: scaleItemEl }) => {
      scaleItemEl.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(view.broadcast).toBeCalledTimes(3 + scale.items.length);
  });
});
