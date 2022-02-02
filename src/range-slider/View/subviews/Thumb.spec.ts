import Thumb from './Thumb';

describe('Thumb class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const defaultOptions = {
    position: 10,
    visible: true,
    isHigher: false,
  };
  let thumb: Thumb;

  beforeEach(() => {
    thumb = new Thumb(el, defaultOptions);
  });

  test('Can get options', () => {
    const thumbOptions = thumb.getOptions();
    expect(thumbOptions).toMatchObject(defaultOptions);
  });

  test('Can update options', () => {
    const newOptions = { visible: false, isHigher: true };
    thumb.setOptions(newOptions);

    const thumbOptions = thumb.getOptions();
    expect(thumbOptions).toMatchObject({ ...defaultOptions, ...newOptions });
  });

  test('It handles pointerdown event', () => {
    const broadcastMock = jest.spyOn(thumb, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(broadcastMock).toBeCalled();
  });
});
