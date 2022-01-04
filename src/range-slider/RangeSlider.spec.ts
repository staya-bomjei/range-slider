import RangeSlider from './RangeSlider';

// Выключаю эту проверку тут, потому что импорты функций
// describe, it, expect выполняются при запуске karma
/* eslint-disable no-undef */

test('RangeSlider can create', () => {
  const el = document.createElement('div');
  const slider = new RangeSlider(el);
  expect(slider).not.toBeNull();
});
