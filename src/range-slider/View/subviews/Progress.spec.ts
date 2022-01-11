import Progress from './Progress';

describe('Progress class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const options = { from: 10, to: 20, visible: true };
  const progress = new Progress(el, options);

  test('Can set and get options', () => {
    expect(progress.getOptions()).toMatchObject(options);
  });

  test('Can update options', () => {
    progress.setOptions({ visible: false });
    expect(progress.getOptions()).toMatchObject({ ...options, visible: false });
  });
});
