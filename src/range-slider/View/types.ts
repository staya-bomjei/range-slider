type ViewOptions = {
};

// Это объявление типа, поэтому переменная не используется
// eslint-disable-next-line no-unused-vars
type ViewCallBack = (data: ViewOptions) => void;

interface IView {
  readonly el: HTMLElement,
  render(): void,
}

export {
  ViewOptions,
  ViewCallBack,
  IView,
};
