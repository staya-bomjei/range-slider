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
    const newOptions = { position: 40, text: 'new text' };
    scaleItem.setOptions(newOptions);
    expect(scaleItem.getOptions()).toMatchObject({ ...options, ...newOptions });
  });

  test('it should do nothing', () => {
    const originalOptions = scaleItem.getOptions();
    const newOptions = {};
    scaleItem.setOptions(newOptions);
    expect(scaleItem.getOptions()).toMatchObject(originalOptions);
  });

  test('It handles pointerdown event', () => {
    jest.spyOn(scaleItem, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(scaleItem.broadcast).toBeCalled();
  });
});
