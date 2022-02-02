import Progress from './Progress';

describe('Progress class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const defaultOptions = { from: 10, to: 20, visible: true };
  let progress: Progress;

  beforeEach(() => {
    progress = new Progress(el, defaultOptions);
  });

  test('Can get options', () => {
    const progressOptions = progress.getOptions();
    expect(progressOptions).toMatchObject(defaultOptions);
  });

  test('Can update options', () => {
    const newOptions = { visible: false };
    progress.setOptions(newOptions);

    const progressOptions = progress.getOptions();
    expect(progressOptions).toMatchObject({ ...defaultOptions, ...newOptions });
  });
});
