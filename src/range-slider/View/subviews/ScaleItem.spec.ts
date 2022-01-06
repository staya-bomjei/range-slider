import ScaleItem from './ScaleItem';

describe('ScaleItem class:', () => {
  document.body.innerHTML = '<div><div>';
  const el = document.body.children[0] as HTMLElement;
  const scaleItem = new ScaleItem(el);

  test('Can set and get options', () => {
    const newOptions = { position: 10, text: 'test' };

    scaleItem.setOptions(newOptions);
    expect(scaleItem.getOptions()).toMatchObject(newOptions);
  });

  test('It handles mousedown event', () => {
    jest.spyOn(scaleItem, 'broadcast');

    el.dispatchEvent(new MouseEvent('mousedown'));

    expect(scaleItem.broadcast).toBeCalled();
  });
});
