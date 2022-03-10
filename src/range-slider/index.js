/* eslint-disable func-names */
/* eslint-disable wrap-iife */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import Presenter from './Presenter/Presenter';

import './range-slider.scss';

(function ($) {
  $.fn.rangeSlider = function (methodOrOptions, optionsOrNothing) {
    const methods = {
      init(opts) {
        return this.each(function (_, el) {
          const presenter = new Presenter(el);
          const model = presenter.getModel();
          model.setOptions(opts);
          $(el).data().rangeSlider = presenter;
        });
      },
      get() {
        const rangeSlider = $(this).data('rangeSlider');
        const model = rangeSlider.getModel();
        return model.getOptions();
      },
      set(opts) {
        const rangeSlider = $(this).data('rangeSlider');
        const model = rangeSlider.getModel();
        model.setOptions(opts);
      },
      onchange(callback) {
        const rangeSlider = $(this).data('rangeSlider');
        const model = rangeSlider.getModel();
        model.subscribe(callback);
      },
      unsubscribe(callback) {
        const rangeSlider = $(this).data('rangeSlider');
        const model = rangeSlider.getModel();
        model.unsubscribe(callback);
      },
    };

    const hasMethod = methods[methodOrOptions] !== undefined;
    if (hasMethod) {
      return methods[methodOrOptions].apply(this, [optionsOrNothing]);
    }

    const isInitMethod = typeof methodOrOptions === 'object' || methodOrOptions === undefined;
    if (isInitMethod) {
      const opts = (methodOrOptions === undefined) ? {} : methodOrOptions;
      return methods.init.call(this, opts);
    }

    $.error(`Unknown method '${methodOrOptions}'`);
    return null;
  };
})(jQuery);
