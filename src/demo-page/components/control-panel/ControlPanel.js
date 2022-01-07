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

export default class ControlPanel {
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

    this.updateInputs();
    this.attachEventHandlers();
  }

  attachEventHandlers() {
    this.$slider.rangeSlider('onchange', () => this.updateInputs());

    this.$min.on('change', () => this.handleMinChange());
    this.$max.on('change', () => this.handleMaxChange());
    this.$step.on('change', () => this.handleStepChange());
    this.$from.on('change', () => this.handleFromChange());
    this.$to.on('change', () => this.handleToChange());
    this.$parts.on('change', () => this.handlePartsChange());

    this.$vertical.on('change', () => this.handleVerticalChange());
    this.$range.on('change', () => this.handleRangeChange());
    this.$scale.on('change', () => this.handleScaleChange());
    this.$bar.on('change', () => this.handleBarChange());
    this.$tip.on('change', () => this.handleTipChange());
  }

  handleMinChange() {
    const min = Number(this.$min.val());
    this.setValid({ min });
  }

  handleMaxChange() {
    const max = Number(this.$max.val());
    this.setValid({ max });
  }

  handleStepChange() {
    const step = Number(this.$step.val());
    this.setValid({ step });
  }

  handleFromChange() {
    const valueFrom = Number(this.$from.val());
    this.setValid({ valueFrom });
  }

  handleToChange() {
    const valueTo = Number(this.$to.val());
    this.setValid({ valueTo });
  }

  handlePartsChange() {
    const scaleParts = Number(this.$parts.val());
    this.setValid({ scaleParts });
  }

  handleVerticalChange() {
    let { orientation } = this.get();
    orientation = (orientation === 'horizontal') ? 'vertical' : 'horizontal';
    this.set({ orientation });
  }

  handleRangeChange() {
    const { isRange } = this.get();
    this.setValid({ isRange: !isRange });
  }

  handleScaleChange() {
    const { showScale } = this.get();
    this.set({ showScale: !showScale });
  }

  handleBarChange() {
    const { showProgress } = this.get();
    this.set({ showProgress: !showProgress });
  }

  handleTipChange() {
    const { showTooltip } = this.get();
    this.set({ showTooltip: !showTooltip });
  }

  get() {
    return this.$slider.rangeSlider('get');
  }

  set(options) {
    this.$slider.rangeSlider('set', options);
  }

  setValid(options, rCnt = 0) {
    if (rCnt > 10) {
      throw new Error('Stack Overflow');
    }
    try {
      this.set(options);
    } catch (error) {
      const { value } = error;
      if (value === undefined) throw error;
      console.log('start validate');
      console.log(error.message);
      console.log(options);

      const min = (options.min !== undefined) ? options.min : this.get().min;
      const max = (options.max !== undefined) ? options.max : this.get().max;

      const isNeedsValueTo = value === 'isRange';
      const isWrongScaleParts = value === 'scaleParts';
      const isWrongValueFrom = value === 'valueFrom';
      const isWrongValueTo = value === 'valueTo';

      if (isNeedsValueTo || isWrongValueTo) {
        this.setValid({ ...options, valueTo: max }, rCnt + 1);
      }

      if (isWrongScaleParts) {
        this.setValid({ ...options, scaleParts: 1 }, rCnt + 1);
      }

      if (isWrongValueFrom) {
        this.setValid({ ...options, valueFrom: min }, rCnt + 1);
      }
      console.log('end validate');
    }
  }

  updateInputs() {
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
