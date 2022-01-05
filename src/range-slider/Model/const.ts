import { ModelOptions } from './types';

const defaultOptions = {
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
} as ModelOptions;

const optionsTypes: {
  [key in keyof ModelOptions]: 'number' | 'boolean' | 'string[]' | 'orientation'
} = {
  min: 'number',
  max: 'number',
  step: 'number',
  strings: 'string[]',
  valueFrom: 'number',
  valueTo: 'number',
  isRange: 'boolean',
  orientation: 'orientation',
  showScale: 'boolean',
  scaleParts: 'number',
  showTooltip: 'boolean',
  showProgress: 'boolean',
};

export {
  defaultOptions,
  optionsTypes,
};
