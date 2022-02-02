import Tooltip from './Tooltip';

describe('Tooltip class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const defaultOptions = {
    text: 'test',
    visible: true,
  };
  let tooltip: Tooltip;

  beforeEach(() => {
    tooltip = new Tooltip(el, defaultOptions);
  });

  test('Can set and get options', () => {
    const tooltipOptions = tooltip.getOptions();
    expect(tooltipOptions).toMatchObject(defaultOptions);
  });

  test('Can update options', () => {
    const newOptions = { visible: false };
    tooltip.setOptions(newOptions);

    const tooltipOptions = tooltip.getOptions();
    expect(tooltipOptions).toMatchObject({ ...defaultOptions, ...newOptions });
  });
});
