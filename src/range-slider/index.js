/* eslint-disable func-names */
/* eslint-disable wrap-iife */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import Presenter from './Presenter/Presenter';

import './range-slider.scss';

(function ($) {
  $.fn.rangeSlider = function (method, options) {
    const methods = {
      init(opts) {
        return this.each(function (_, el) {
          const presenter = new Presenter(el);
          presenter.model.setOptions(opts);
          $(el).data().rangeSlider = presenter;
        });
      },
      get() {
        const rangeSlider = $(this).data('rangeSlider');
        const { model } = rangeSlider;
        return model.getOptions();
      },
      set(opts) {
        const rangeSlider = $(this).data('rangeSlider');
        const { model } = rangeSlider;
        model.setOptions(opts);
      },
      onchange(callback) {
        const rangeSlider = $(this).data('rangeSlider');
        const { model } = rangeSlider;
        model.subscribe(callback);
      },
    };

    if (methods[method]) {
      return methods[method].apply(this, [options]);
    }
    if (typeof method === 'object' || !method) {
      const opts = method || {};
      return methods.init.call(this, opts);
    }
    $.error(`Unknown method '${method}'`);
    return null;
  };
})(jQuery);
