import RangeSlider from '../range-slider/RangeSlider';
import './styles/global.scss';
import './styles/fonts.scss';
import './demo-page.scss';

document.addEventListener('DOMContentLoaded', () => {
  const selector: string = 'js-slider';
  const elements = document.getElementsByClassName(selector);
  Array.from(elements).forEach((el) => {
    const rangeSlider = new RangeSlider(el as HTMLElement);

    rangeSlider.setOption('min', 120);
  });
});
