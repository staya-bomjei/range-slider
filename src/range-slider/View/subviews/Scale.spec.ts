import Scale from './Scale';

describe('Scale class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  if (!(el instanceof HTMLElement)) {
    throw new Error('el should be HTMLElement');
  }

  const options = {
    visible: true,
    items: [
      {
        position: 0,
        text: '0',
      },
      {
        position: 50,
        text: '1',
      },
      {
        position: 100,
        text: '2',
      },
    ],
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

  test('It adds new ScaleItem', () => {
    const newOptions = {
      items: [
        {
          position: 0,
          text: '0',
        },
        {
          position: 25,
          text: '1.5',
        },
        {
          position: 50,
          text: '1',
        },
        {
          position: 100,
          text: '2',
        },
      ],
    };
    scale.setOptions(newOptions);

    const scaleOptions = scale.getOptions();
    expect(scaleOptions).toMatchObject({ ...options, ...newOptions });
  });

  test('It handles pointerdown event', () => {
    const broadcastMock = jest.spyOn(scale, 'broadcast');
    const items = scale.getItems();
    const scaleItemsCounter = items.length;

    items.forEach((item) => {
      const itemEl = item.getEl();
      itemEl.dispatchEvent(new MouseEvent('pointerdown'));
    });

    expect(broadcastMock).toBeCalledTimes(scaleItemsCounter);
  });
});
