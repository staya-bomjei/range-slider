import Progress from './subviews/Progress';
import Scale from './subviews/Scale';
import ScaleItem from './subviews/ScaleItem';
import Thumb from './subviews/Thumb';
import Tooltip from './subviews/Tooltip';
import Track from './subviews/Track';

type ProgressOptions = {
  from: number,
  to: number,
  visible: boolean,
};

type ScaleItemOptions = {
  position: number,
  text: string,
};

type ScaleOptions = {
  visible: boolean,
  items: Array<ScaleItemOptions>;
};

type ThumbOptions = {
  position: number,
  visible: boolean,
  isHigher: boolean,
};

type TooltipOptions = {
  text: string,
  visible: boolean,
};

type ViewEvent = {
  view: Thumb | ScaleItem | Track,
  event: MouseEvent,
}

type ViewOptions = {
  isVertical: boolean,
  progress: ProgressOptions,
  scale: ScaleOptions,
  leftThumb: ThumbOptions,
  rightThumb: ThumbOptions,
  leftTooltip: TooltipOptions,
  rightTooltip: TooltipOptions,
};

type SubViews = {
  track: Track,
  progress: Progress,
  scale: Scale,
  leftThumb: Thumb,
  rightThumb: Thumb,
  leftTooltip: Tooltip,
  rightTooltip: Tooltip,
};

export {
  ProgressOptions,
  ScaleOptions,
  ScaleItemOptions,
  ThumbOptions,
  TooltipOptions,
  ViewEvent,
  ViewOptions,
  SubViews,
};
