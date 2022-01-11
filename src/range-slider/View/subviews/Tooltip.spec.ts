import Tooltip from './Tooltip';

describe('Tooltip class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const options = {
    text: 'test',
    visible: true,
  };
  const tooltip = new Tooltip(el, options);

  test('Can set and get options', () => {
    tooltip.setOptions(options);
    expect(tooltip.getOptions()).toMatchObject(options);
  });

  test('Can update options', () => {
    tooltip.setOptions({ visible: false });
    expect(tooltip.getOptions()).toMatchObject({ ...options, visible: false });
  });
});
