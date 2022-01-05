import ScaleItem from './ScaleItem';

describe('ScaleItem class:', () => {
  document.body.innerHTML = '<div><div>';
  const [el] = document.body.children;
  const scaleItem = new ScaleItem(el as HTMLElement);

  test('Can set and get options', () => {
    const newOptions = { position: 10, text: 'test' };

    scaleItem.setOptions(newOptions);
    expect(scaleItem.getOptions()).toMatchObject(newOptions);
  });
});
