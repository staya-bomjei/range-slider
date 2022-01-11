import Thumb from './Thumb';

describe('Thumb class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const options = {
    position: 10,
    visible: true,
    isHigher: false,
  };
  const thumb = new Thumb(el, options);

  test('Can set and get options', () => {
    expect(thumb.getOptions()).toMatchObject(options);
  });

  test('Can update options', () => {
    thumb.setOptions({ visible: false });
    expect(thumb.getOptions()).toMatchObject({ ...options, visible: false });
    thumb.setOptions({ isHigher: true });
    expect(thumb.getOptions()).toMatchObject({ ...options, visible: false, isHigher: true });
  });

  test('It handles pointerdown event', () => {
    jest.spyOn(thumb, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(thumb.broadcast).toBeCalled();
  });
});
