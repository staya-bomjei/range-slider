type Orientation = 'horizontal' | 'vertical';

type ModelOptions = {
  min?: number,
  max?: number,
  strings?: Array<string>,
  step?: number,
  isRange?: boolean,
  orientation: Orientation,
  scaleParts: number,
  showScale: boolean,
  showTooltip: boolean,
  showTooltipAfterDrag?: boolean,
  showProgress: boolean,
  allowThumbsSwap?: boolean,
};

type ModelOptionValues = number | Array<string> | boolean | Orientation;

// Это объявление типа, поэтому переменная не используется
// eslint-disable-next-line no-unused-vars
type ModelCallback = (data: ModelOptions) => void;

export {
  Orientation,
  ModelOptions,
  ModelOptionValues,
  ModelCallback,
};
