import ScaleItem from './ScaleItem';

describe('ScaleItem class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const options = { position: 10, text: 'test' };
  const scaleItem = new ScaleItem(el, options);

  test('Can set and get options', () => {
    expect(scaleItem.getOptions()).toMatchObject(options);
  });

  test('It handles pointerdown event', () => {
    jest.spyOn(scaleItem, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(scaleItem.broadcast).toBeCalled();
  });
});
