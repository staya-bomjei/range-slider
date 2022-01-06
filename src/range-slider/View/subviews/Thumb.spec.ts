import Thumb from './Thumb';

describe('Thumb class:', () => {
  document.body.innerHTML = '<div><div>';
  const el = document.body.children[0] as HTMLElement;
  const thumb = new Thumb(el);
  const newOptions = {
    position: 10,
    visible: true,
    isHigher: false,
  };

  test('Can set and get options', () => {
    thumb.setOptions(newOptions);
    expect(thumb.getOptions()).toMatchObject(newOptions);
  });

  test('Can update options', () => {
    thumb.setOptions({ visible: false });
    expect(thumb.getOptions()).toMatchObject({ ...newOptions, visible: false });
    thumb.setOptions({ isHigher: true });
    expect(thumb.getOptions()).toMatchObject({ ...newOptions, visible: false, isHigher: true });
  });

  test('It handles mousedown event', () => {
    jest.spyOn(thumb, 'broadcast');

    el.dispatchEvent(new MouseEvent('mousedown'));

    expect(thumb.broadcast).toBeCalled();
  });
});
