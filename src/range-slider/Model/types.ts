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

export {
  Orientation,
  ModelOptions,
};
