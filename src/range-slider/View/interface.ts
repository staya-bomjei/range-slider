export default interface IView {
  readonly el: HTMLElement;
  render(): void;
// eslint сошел с ума, он требует тут ";", но если её поставить,
// то он требует её убрать
// eslint-disable-next-line semi
}
