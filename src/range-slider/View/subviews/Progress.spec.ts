import Progress from './Progress';

describe('Progress class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const progress = new Progress(el as HTMLElement);

  test('Can set and get options', () => {
    const newOptions = { from: 10, to: 20, visible: true };

    progress.setOptions(newOptions);
    expect(progress.getOptions()).toMatchObject(newOptions);

    progress.setOptions({ visible: false });
    expect(progress.getOptions()).toMatchObject({ ...newOptions, visible: false });
  });
});
