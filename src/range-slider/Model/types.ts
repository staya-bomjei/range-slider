type Orientation = 'horizontal' | 'vertical';

type ModelOptions = {
  min: number,
  max: number,
  step: number,
  strings: Array<string>,
  valueFrom: number,
  valueTo: number,
  isRange: boolean,
  orientation: Orientation,
  showScale: boolean,
  scaleParts: number,
  showTooltip: boolean,
  showProgress: boolean,
};

// Это объявление типа, поэтому переменная не используется
// eslint-disable-next-line no-unused-vars
type ModelCallback = (data: ModelOptions) => void;

export {
  Orientation,
  ModelOptions,
  ModelCallback,
};
