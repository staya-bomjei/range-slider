import { Options } from '../../Options/types';

type ScaleOptions = {
  min: number,
  max: number,
  step: number,
  scaleParts: number,
  strings?: Array<string>,
  showScale: boolean,
};

type ThumbOptions = {
  percentStep: number,
  visible: boolean,
  value: number,
  showTooltip?: boolean,
  showTooltipAfterDrag?: boolean,
};

const thumbDependencies: Array<keyof Options> = [
  'min',
  'max',
  'step',
  'valueFrom',
  'valueTo',
  'isRange',
  'showTooltip',
  'showTooltipAfterDrag',
];

export {
  ScaleOptions,
  ThumbOptions,
  thumbDependencies,
};
