import {
  CANVAS,
  KEY,
  TAPPERS,
  SLIDER,
  CELLS_PER_ROW,
  CELL_SIZE,
  CELL_GAP,
  CELLS_PER_COLUMN,
} from './const';

class TapperView {
  constructor($component) {
    this.$component = $component;
    this.$slider = $(SLIDER, $component);
    this.$key = $(KEY, $component);
    this.$canvas = $(CANVAS, $component);
  }

  init() {
    const tappers = JSON.parse(this.$component.attr(TAPPERS));
    const names = tappers.map((tapper) => tapper.name);
    this.keys = tappers.map((tapper) => tapper.key);
    this.keysBits = this.keys.map((_, index) => (
      this._keyToBinaryArray(index)
    ));
    this.$slider.rangeSlider({ strings: names, showScale: false });

    const canvasWidth = CELLS_PER_ROW * CELL_SIZE + ((CELLS_PER_ROW - 1) * CELL_GAP);
    const canvasHeight = CELLS_PER_COLUMN * CELL_SIZE + ((CELLS_PER_COLUMN - 1) * CELL_GAP);
    this.$canvas.attr('width', canvasWidth);
    this.$canvas.attr('height', canvasHeight);
    this.ctx = this.$canvas[0].getContext('2d');

    this._update();
    this._attachEventHandlers();
  }

  _attachEventHandlers() {
    this.$slider.rangeSlider('onchange', () => this._update());
  }

  _update() {
    this._updateKey();
    this._updateCanvas();
  }

  _updateKey() {
    const { valueFrom } = this.$slider.rangeSlider('get');
    this.$key.html(this.keys[valueFrom]);
  }

  _updateCanvas() {
    const { valueFrom } = this.$slider.rangeSlider('get');
    const bits = this.keysBits[valueFrom];

    this._clearCanvas();
    bits.forEach((bit, index) => {
      if (bit) this._drawCell(index);
    });
  }

  _drawCell(index) {
    const posX = CELLS_PER_ROW - Math.trunc(index / CELLS_PER_COLUMN) - 1;
    const posY = index % CELLS_PER_COLUMN;

    const x = posX * CELL_SIZE + posX * CELL_GAP;
    const y = posY * CELL_SIZE + posY * CELL_GAP;
    const width = CELL_SIZE;
    const height = CELL_SIZE;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x, y, width, height);
  }

  _clearCanvas() {
    const width = Number(this.$canvas.attr('width'));
    const height = Number(this.$canvas.attr('height'));

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, width, height);
  }

  _keyToBinaryArray(index) {
    const key = BigInt(this.keys[index]);
    let bigNumber = key / BigInt(CELLS_PER_COLUMN);
    const binaryArray = [];

    while (bigNumber > 0n) {
      binaryArray.push(bigNumber % 2n);
      bigNumber /= 2n;
    }

    return binaryArray;
  }
}

export default TapperView;
