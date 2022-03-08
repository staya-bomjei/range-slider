import { ViewOptions } from './types';
import View from './View';

describe('View class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const defaultOptions: ViewOptions = {
    isVertical: true,
    progress: { from: 10, to: 20, visible: true },
    scale: {
      visible: true,
      items: [
        {
          position: 0,
          text: '0',
        },
        {
          position: 50,
          text: '1',
        },
        {
          position: 100,
          text: '2',
        },
      ],
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
  let view: View;

  beforeEach(() => {
    view = new View(el, defaultOptions);
  });

  test('Can get options', () => {
    const viewOptions = view.getOptions();
    expect(viewOptions).toMatchObject(defaultOptions);
  });

  test('Can update options', () => {
    const newOptions = { isVertical: false };
    view.setOptions(newOptions);

    const viewOptions = view.getOptions();
    expect(viewOptions).toMatchObject({ ...defaultOptions, ...newOptions });
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
