import Scale from './Scale';

describe('Scale class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const options = {
    min: 0,
    max: 10,
    step: 1,
    visible: true,
    partsCounter: 5,
  };
  const scale = new Scale(el, options);

  test('Can set and get options', () => {
    expect(scale.getOptions()).toMatchObject(options);
  });

  test('Can update options', () => {
    scale.setOptions({ visible: false });
    expect(scale.getOptions()).toMatchObject({ ...options, visible: false });
  });

  test('Can set strings', () => {
    scale.setOptions({ strings: 'test,'.repeat(11).split(',') });
    scale.items.forEach((scaleItem) => {
      expect(scaleItem.getOptions().text).toEqual('test');
    });
  });

  test('It handles pointerdown event', () => {
    jest.spyOn(scale, 'broadcast');

    const scaleItemsCounter = scale.items.length;

    scale.items.forEach(({ el: scaleItemEl }) => {
      scaleItemEl.dispatchEvent(new MouseEvent('pointerdown'));
    });

    expect(scale.broadcast).toBeCalledTimes(scaleItemsCounter);
  });

  test('should throw error', () => {
    expect(() => {
      scale.setOptions({ strings: ['0', '1'], min: 2, max: 4 });
    }).toThrow('strings(0,1) must have string item with index 2');
  });
});
