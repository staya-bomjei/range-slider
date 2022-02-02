import {
  BAR_INPUT,
  FROM_INPUT,
  MAX_INPUT,
  MIN_INPUT,
  PARTS_INPUT,
  RANGE_INPUT,
  SCALE_INPUT,
  SLIDER,
  SLIDER_OPTIONS,
  STEP_INPUT,
  TIP_INPUT,
  TO_INPUT,
  VERTICAL_INPUT,
} from './const';

class ControlPanel {
  constructor($component) {
    this.$component = $component;
    this.$slider = $(SLIDER, $component);
    this.$min = $(MIN_INPUT, $component);
    this.$max = $(MAX_INPUT, $component);
    this.$step = $(STEP_INPUT, $component);
    this.$from = $(FROM_INPUT, $component);
    this.$to = $(TO_INPUT, $component);
    this.$parts = $(PARTS_INPUT, $component);
    this.$vertical = $(VERTICAL_INPUT, $component);
    this.$range = $(RANGE_INPUT, $component);
    this.$scale = $(SCALE_INPUT, $component);
    this.$bar = $(BAR_INPUT, $component);
    this.$tip = $(TIP_INPUT, $component);
  }

  init() {
    const sliderOptions = JSON.parse(this.$component.attr(SLIDER_OPTIONS));
    this.$slider.rangeSlider(sliderOptions);

    this._updateInputs();

    this._updateInputs = this._updateInputs.bind(this);
    this._handleMinChange = this._handleMinChange.bind(this);
    this._handleMaxChange = this._handleMaxChange.bind(this);
    this._handleStepChange = this._handleStepChange.bind(this);
    this._handleFromChange = this._handleFromChange.bind(this);
    this._handleToChange = this._handleToChange.bind(this);
    this._handlePartsChange = this._handlePartsChange.bind(this);
    this._handleVerticalChange = this._handleVerticalChange.bind(this);
    this._handleRangeChange = this._handleRangeChange.bind(this);
    this._handleScaleChange = this._handleScaleChange.bind(this);
    this._handleBarChange = this._handleBarChange.bind(this);
    this._handleTipChange = this._handleTipChange.bind(this);
    this._attachEventHandlers();
  }

  _attachEventHandlers() {
    this.$slider.rangeSlider('onchange', this._updateInputs);
    this.$min.on('change', this._handleMinChange);
    this.$max.on('change', this._handleMaxChange);
    this.$step.on('change', this._handleStepChange);
    this.$from.on('change', this._handleFromChange);
    this.$to.on('change', this._handleToChange);
    this.$parts.on('change', this._handlePartsChange);
    this.$vertical.on('change', this._handleVerticalChange);
    this.$range.on('change', this._handleRangeChange);
    this.$scale.on('change', this._handleScaleChange);
    this.$bar.on('change', this._handleBarChange);
    this.$tip.on('change', this._handleTipChange);
  }

  _handleMinChange() {
    const min = Number(this.$min.val());
    this._setValidOptions({ min });
  }

  _handleMaxChange() {
    const max = Number(this.$max.val());
    this._setValidOptions({ max });
  }

  _handleStepChange() {
    const step = Number(this.$step.val());
    this._setValidOptions({ step });
  }

  _handleFromChange() {
    const valueFrom = Number(this.$from.val());
    this._setValidOptions({ valueFrom });
  }

  _handleToChange() {
    const valueTo = Number(this.$to.val());
    this._setValidOptions({ valueTo });
  }

  _handlePartsChange() {
    const scaleParts = Number(this.$parts.val());
    this._setValidOptions({ scaleParts });
  }

  _handleVerticalChange() {
    let { orientation } = this._getOptions();
    orientation = (orientation === 'horizontal') ? 'vertical' : 'horizontal';
    this._setOptions({ orientation });
  }

  _handleRangeChange() {
    const { isRange } = this._getOptions();
    this._setValidOptions({ isRange: !isRange });
  }

  _handleScaleChange() {
    const { showScale } = this._getOptions();
    this._setOptions({ showScale: !showScale });
  }

  _handleBarChange() {
    const { showProgress } = this._getOptions();
    this._setOptions({ showProgress: !showProgress });
  }

  _handleTipChange() {
    const { showTooltip } = this._getOptions();
    this._setOptions({ showTooltip: !showTooltip });
  }

  _getOptions() {
    return this.$slider.rangeSlider('get');
  }

  _setOptions(options) {
    this.$slider.rangeSlider('set', options);
  }

  _setValidOptions(options, recursionCounter = 0) {
    if (recursionCounter > 10) {
      throw new Error('Stack Overflow');
    }
    try {
      console.warn('try to set options', options);
      this._setOptions(options);
    } catch (error) {
      const { value } = error;
      if (value === undefined) throw error;
      const isNeedsValueTo = value === 'isRange';
      const isWrongScaleParts = value === 'scaleParts';
      const isWrongValueFrom = value === 'valueFrom';
      const isWrongValueTo = value === 'valueTo';

      const originalOptions = this._getOptions();
      const min = (options.min !== undefined) ? options.min : originalOptions.min;
      const max = (options.max !== undefined) ? options.max : originalOptions.max;

      console.warn('start validation');
      console.warn('original options: ', originalOptions);
      console.warn('trying to set options: ', options);
      console.error(`error message: ${error.message}`);

      if (isNeedsValueTo || isWrongValueTo) {
        this._setValidOptions({ ...options, valueTo: max }, recursionCounter + 1);
      }

      if (isWrongScaleParts) {
        this._setValidOptions({ ...options, scaleParts: 1 }, recursionCounter + 1);
      }

      if (isWrongValueFrom) {
        this._setValidOptions({ ...options, valueFrom: min }, recursionCounter + 1);
      }

      this._updateInputs();

      console.warn('end validation');
    }
  }

  _updateInputs() {
    const {
      min,
      max,
      step,
      valueFrom,
      valueTo,
      isRange,
      orientation,
      showScale,
      scaleParts,
      showTooltip,
      showProgress,
    } = this.$slider.rangeSlider('get');

    this.$min.val(min);
    this.$max.val(max);
    this.$step.val(step);
    this.$from.val(valueFrom);
    this.$from.attr('min', min);
    this.$from.attr('max', max);
    this.$from.attr('step', step);
    this.$parts.val(scaleParts);

    if (isRange) {
      this.$to.attr('disabled', false);
      this.$to.val(valueTo);
      this.$to.attr('min', min);
      this.$to.attr('max', max);
      this.$to.attr('step', step);
    } else {
      this.$to.attr('disabled', true);
      this.$to.val('');
    }

    this.$range.attr('checked', isRange);
    this.$vertical.attr('checked', orientation === 'vertical');
    this.$scale.attr('checked', showScale);
    this.$tip.attr('checked', showTooltip);
    this.$bar.attr('checked', showProgress);
  }
}

export default ControlPanel;
