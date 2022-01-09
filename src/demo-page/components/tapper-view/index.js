import TapperView from './TapperView';
import { TAPPER_VIEW } from './const';

import './tapper-view.scss';

$(() => {
  $(TAPPER_VIEW).each((_, node) => {
    const $node = $(node);
    const controlPanel = new TapperView($node);
    controlPanel.init();
  });
});
