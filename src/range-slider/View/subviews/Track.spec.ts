import Track from './Track';

describe('Track class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  let track: Track;

  beforeEach(() => {
    track = new Track(el);
  });

  test('It handles pointerdown event', () => {
    const broadcastMock = jest.spyOn(track, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(broadcastMock).toBeCalled();
  });
});
