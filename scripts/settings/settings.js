import { onColorChange, inputColor } from './color-change.js';

// selecting the element of the color change event
const colorInput = document.querySelector('.event-color');

// color change event listeners
colorInput.addEventListener('input', onColorChange);
document.addEventListener('DOMContentLoaded', inputColor);