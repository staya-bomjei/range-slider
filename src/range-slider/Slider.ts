export default class Slider {
  private isRange: boolean;

  constructor(isRange: boolean) {
    this.isRange = isRange;
  }

  getState() {
    return {
      isRange: this.isRange,
    };
  }
}
