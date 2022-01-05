import Scale from './Scale';

describe('Scale class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const scale = new Scale(el as HTMLElement);
  const newOptions = {
    min: 0,
    max: 10,
    step: 1,
    visible: true,
  };

  test('Can set and get options', () => {
    scale.setOptions(newOptions);
    expect(scale.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    scale.setOptions({ visible: false });
    expect(scale.getOptions()).toMatchObject({ ...newOptions, visible: false });
  });
});
