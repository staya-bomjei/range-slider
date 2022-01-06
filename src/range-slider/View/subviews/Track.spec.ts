import Track from './Track';

describe('Track class:', () => {
  document.body.innerHTML = '<div><div>';
  const el = document.body.children[0] as HTMLElement;
  const track = new Track(el);

  test('It handles mousedown event', () => {
    jest.spyOn(track, 'broadcast');

    el.dispatchEvent(new MouseEvent('mousedown'));

    expect(track.broadcast).toBeCalled();
  });
});
