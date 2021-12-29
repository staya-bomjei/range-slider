import Slider from './Slider';

// Выключаю эту проверку тут, потому что импорты функций
// describe, it, expect выполняются при запуске karma
/* eslint-disable no-undef */

describe('Slider returns initial', () => {
  it('it returns {isRange: true}', () => {
    const slider: Slider | null = new Slider(true);
    const { isRange } = slider.getState();

    expect(isRange).toBe(true);
  });
});
