import Scale from './Scale';

describe('Scale class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const scale = new Scale(el as HTMLElement);

  test('Can set and get options', () => {
    const newOptions = {
      min: 0,
      max: 10,
      step: 1,
      visible: true,
    };

    scale.setOptions(newOptions);
    expect(scale.getOptions()).toMatchObject(newOptions);

    scale.setOptions({ visible: false });
    expect(scale.getOptions()).toMatchObject({ ...newOptions, visible: false });
  });
});
