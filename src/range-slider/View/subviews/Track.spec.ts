import Track from './Track';

describe('Track class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;

  test('Can create', () => {
    const track = new Track(el as HTMLElement);
    expect(track).toBeInstanceOf(Track);
  });
});
