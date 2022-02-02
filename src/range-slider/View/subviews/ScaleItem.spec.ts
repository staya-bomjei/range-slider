import ScaleItem from './ScaleItem';

describe('ScaleItem class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const defaultOptions = { position: 10, text: 'test' };
  let scaleItem: ScaleItem;

  beforeEach(() => {
    scaleItem = new ScaleItem(el, defaultOptions);
  });

  test('Can get options', () => {
    const scaleItemOptions = scaleItem.getOptions();
    expect(scaleItemOptions).toMatchObject(defaultOptions);
  });

  test('Can update options', () => {
    const newOptions = { position: 40, text: 'new text' };
    scaleItem.setOptions(newOptions);

    const scaleItemOptions = scaleItem.getOptions();
    expect(scaleItemOptions).toMatchObject({ ...defaultOptions, ...newOptions });
  });

  test('it should do nothing', () => {
    const originalOptions = scaleItem.getOptions();
    const newOptions = {};
    scaleItem.setOptions(newOptions);

    const scaleItemOptions = scaleItem.getOptions();
    expect(scaleItemOptions).toMatchObject(originalOptions);
  });

  test('It handles pointerdown event', () => {
    const broadcastMock = jest.spyOn(scaleItem, 'broadcast');

    el.dispatchEvent(new MouseEvent('pointerdown'));

    expect(broadcastMock).toBeCalled();
  });
});
