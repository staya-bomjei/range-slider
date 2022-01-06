/* eslint-disable no-undef */
import '../range-slider';
import './styles/global.scss';
import './styles/fonts.scss';
import './demo-page.scss';

$(() => {
  const $sliders = $('.js-slider');
  $sliders.rangeSlider();
  const [$first, $second] = Array.from($sliders).map((item) => $(item));
  console.log($first.rangeSlider('get'));
  console.log($second.rangeSlider('get'));
  $first.rangeSlider('set', { valueFrom: 22 });
  console.log($first.rangeSlider('get'));
  console.log($second.rangeSlider('get'));
});
