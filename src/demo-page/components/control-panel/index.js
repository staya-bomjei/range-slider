import '../../../range-slider';
import '../toggle';
import '../input';

import ControlPanel from './ControlPanel';
import { CONTROL_PANEL } from './const';

import './control-panel.scss';

$(() => {
  $(CONTROL_PANEL).each((index, node) => {
    const $node = $(node);
    const controlPanel = new ControlPanel($node);
    controlPanel.init();
  });
});
