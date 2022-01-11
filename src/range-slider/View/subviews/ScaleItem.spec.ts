import ScaleItem from './ScaleItem';

describe('ScaleItem class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const scaleItem = new ScaleItem(el);

  test('Can set and get options', () => {
    const newOptions = { position: 10, text: 'test' };

    scaleItem.setOptions(newOptions);
    expect(scaleItem.getOptions()).toMatchObject(newOptions);
  });

  test('It handles pointerdown event', () => {
    jest.spyOn(scaleItem, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(scaleItem.broadcast).toBeCalled();
  });
});
