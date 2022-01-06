import Presenter from './Presenter';

describe('Presenter class:', () => {
  document.body.innerHTML = '<div><div>';
  const el = document.body.children[0] as HTMLElement;
  const presenter = new Presenter(el);
  const { model, view } = presenter;

  test('Correctly updates view when model changes', () => {
    model.setOptions({ valueFrom: 17 });
    const {
      progress,
      leftThumb,
      leftTooltip,
    } = view.getOptions();

    expect(progress.to).toEqual(17);
    expect(leftThumb.position).toEqual(17);
    expect(leftTooltip.text).toEqual('17');
  });
});
