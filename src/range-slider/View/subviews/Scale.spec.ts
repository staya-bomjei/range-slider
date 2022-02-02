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
  let scale: Scale;

  beforeEach(() => {
    scale = new Scale(el, options);
  });

  test('Can get options', () => {
    const scaleOptions = scale.getOptions();
    expect(scaleOptions).toMatchObject(options);
  });

  test('Can update options', () => {
    const newOptions = { visible: false };
    scale.setOptions(newOptions);

    const scaleOptions = scale.getOptions();
    expect(scaleOptions).toMatchObject({ ...options, ...newOptions });
  });

  test('Can set strings', () => {
    const newOptions = { strings: 'test,'.repeat(11).split(',') };
    scale.setOptions(newOptions);

    scale.items.forEach((scaleItem) => {
      const { text } = scaleItem.getOptions();
      expect(text).toEqual('test');
    });
  });

  test('It handles pointerdown event', () => {
    const broadcastMock = jest.spyOn(scale, 'broadcast');
    const scaleItemsCounter = scale.items.length;

    scale.items.forEach(({ el: scaleItemEl }) => {
      scaleItemEl.dispatchEvent(new MouseEvent('pointerdown'));
    });

    expect(broadcastMock).toBeCalledTimes(scaleItemsCounter);
  });

  test('should throw error', () => {
    const newOptions = { strings: ['0', '1'], min: 2, max: 4 };

    expect(() => {
      scale.setOptions(newOptions);
    }).toThrow('strings(0,1) must have string item with index 2');
  });

  test('It doesn\'t make the same items', () => {
    const newOptions = {
      min: -41,
      max: 1,
      step: 20,
      partsCounter: 4,
    };
    scale.setOptions(newOptions);

    const texts = scale.items.map((item) => item.getOptions().text);
    const uniqueItemsCounter = new Set(texts).size;
    expect(texts.length).toEqual(uniqueItemsCounter);
  });
});
