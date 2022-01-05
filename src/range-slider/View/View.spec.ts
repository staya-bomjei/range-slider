import { ViewOptions } from './types';
import View from './View';

describe('View class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const view = new View(el as HTMLElement);
  const newOptions = {
    isVertical: true,
    progress: { from: 10, to: 20, visible: true },
    scale: {
      min: 0,
      max: 10,
      step: 1,
      visible: true,
    },
    leftThumb: {
      position: 10,
      visible: true,
      isHigher: false,
    },
    leftTooltip: { text: 'test', visible: true },
  } as ViewOptions;

  test('Can set and get options', () => {
    view.setOptions(newOptions);
    expect(view.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    view.setOptions({ isVertical: false });
    expect(view.getOptions()).toMatchObject({ ...newOptions, isVertical: false });
  });
});
