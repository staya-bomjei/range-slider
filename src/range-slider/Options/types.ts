type Orientation = 'horizontal' | 'vertical';

type Options = {
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

type OptionValues = number | Array<string> | boolean | Orientation;

// Это объявление типа, поэтому переменная не используется
// eslint-disable-next-line no-unused-vars
type OptionsCallback = (data: Options) => void;

export {
  Orientation,
  Options,
  OptionValues,
  OptionsCallback,
};
