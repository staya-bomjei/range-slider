import Progress from './Progress';

describe('Progress class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const progress = new Progress(el as HTMLElement);
  const newOptions = { from: 10, to: 20, visible: true };

  test('Can set and get options', () => {
    progress.setOptions(newOptions);
    expect(progress.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    progress.setOptions({ visible: false });
    expect(progress.getOptions()).toMatchObject({ ...newOptions, visible: false });
  });
});
