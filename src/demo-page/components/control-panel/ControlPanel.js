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
    const { $slider, $component } = this;
    const sliderOptions = JSON.parse($component.attr(SLIDER_OPTIONS));
    $slider.rangeSlider(sliderOptions);

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
    const {
      $slider,
      $min,
      $max,
      $step,
      $from,
      $parts,
      $to,
      $range,
      $vertical,
      $scale,
      $tip,
      $bar,
    } = this;

    $slider.rangeSlider('onchange', this._updateInputs);
    $min.on('change', this._handleMinChange);
    $max.on('change', this._handleMaxChange);
    $step.on('change', this._handleStepChange);
    $from.on('change', this._handleFromChange);
    $to.on('change', this._handleToChange);
    $parts.on('change', this._handlePartsChange);
    $vertical.on('change', this._handleVerticalChange);
    $range.on('change', this._handleRangeChange);
    $scale.on('change', this._handleScaleChange);
    $bar.on('change', this._handleBarChange);
    $tip.on('change', this._handleTipChange);
  }

  _handleMinChange() {
    const { $min } = this;
    const min = Number($min.val());
    this._setValidOptions({ min });
  }

  _handleMaxChange() {
    const { $max } = this;
    const max = Number($max.val());
    this._setValidOptions({ max });
  }

  _handleStepChange() {
    const { $step } = this;
    const step = Number($step.val());
    this._setValidOptions({ step });
  }

  _handleFromChange() {
    const { $from } = this;
    const valueFrom = Number($from.val());
    this._setValidOptions({ valueFrom });
  }

  _handleToChange() {
    const { $to } = this;
    const valueTo = Number($to.val());
    this._setValidOptions({ valueTo });
  }

  _handlePartsChange() {
    const { $parts } = this;
    const scaleParts = Number($parts.val());
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
    const { $slider } = this;
    return $slider.rangeSlider('get');
  }

  _setOptions(options) {
    const { $slider } = this;
    $slider.rangeSlider('set', options);
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

      const originalOptions = this._getOptions();
      const { valueFrom, valueTo } = { ...originalOptions, ...options };
      const min = (options.min !== undefined) ? options.min : originalOptions.min;
      const max = (options.max !== undefined) ? options.max : originalOptions.max;

      const isNeedsValueTo = value === 'isRange';
      const isWrongScaleParts = value === 'scaleParts';
      const isWrongValueFrom = value === 'valueFrom';
      const isWrongValueTo = value === 'valueTo';
      const isValuesEqual = isWrongValueFrom && valueFrom === valueTo;

      console.warn('start validation');
      console.warn('original options: ', originalOptions);
      console.warn('trying to set options: ', options);
      console.error(`error message: ${error.message}`);

      if (isValuesEqual) {
        this._setValidOptions({ ...options, valueFrom: min, valueTo: max }, recursionCounter + 1);
      } else if (isNeedsValueTo || isWrongValueTo) {
        this._setValidOptions({ ...options, valueTo: max }, recursionCounter + 1);
      } else if (isWrongScaleParts) {
        this._setValidOptions({ ...options, scaleParts: 1 }, recursionCounter + 1);
      } else if (isWrongValueFrom) {
        this._setValidOptions({ ...options, valueFrom: min }, recursionCounter + 1);
      }

      this._updateInputs();

      console.warn('end validation');
    }
  }

  _updateInputs() {
    const {
      $slider,
      $min,
      $max,
      $step,
      $from,
      $parts,
      $to,
      $range,
      $vertical,
      $scale,
      $tip,
      $bar,
    } = this;
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
    } = $slider.rangeSlider('get');

    $min.val(min);
    $max.val(max);
    $step.val(step);
    $from.val(valueFrom);
    $from.attr('min', min);
    $from.attr('max', max);
    $from.attr('step', step);

    if (showScale) {
      $parts.val(scaleParts);
      $parts.attr('disabled', false);
    } else {
      $parts.val('');
      $parts.attr('disabled', true);
    }

    if (isRange) {
      $to.attr('disabled', false);
      $to.val(valueTo);
      $to.attr('min', min);
      $to.attr('max', max);
      $to.attr('step', step);
    } else {
      $to.attr('disabled', true);
      $to.val('');
    }

    $range.attr('checked', isRange);
    $vertical.attr('checked', orientation === 'vertical');
    $scale.attr('checked', showScale);
    $tip.attr('checked', showTooltip);
    $bar.attr('checked', showProgress);
  }
}

export default ControlPanel;
