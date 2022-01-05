import Tooltip from './Tooltip';

describe('Tooltip class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const tooltip = new Tooltip(el as HTMLElement);
  const newOptions = {
    text: 'test',
    visible: true,
  };

  test('Can set and get options', () => {
    tooltip.setOptions(newOptions);
    expect(tooltip.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    tooltip.setOptions({ visible: false });
    expect(tooltip.getOptions()).toMatchObject({ ...newOptions, visible: false });
  });
});
