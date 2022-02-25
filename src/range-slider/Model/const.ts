import { ModelOptions } from './types';

const defaultOptions: ModelOptions = {
  min: 0,
  max: 100,
  step: 1,
  valueFrom: 50,
  orientation: 'horizontal',
  scaleParts: 4,
  isRange: false,
  showScale: true,
  showTooltip: true,
  showProgress: true,
};

export {
  // eslint-disable-next-line import/prefer-default-export
  defaultOptions,
};
