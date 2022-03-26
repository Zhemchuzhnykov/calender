// selecting the element of the color change event
const colorInput = document.querySelector('.event-color');

// function setting a color value to a browser local storage
export const onColorChange = event => {
  localStorage.setItem('eventsColor', JSON.stringify(colorInput.value));
};

// function setting the value of the last-selected color to the colot input
export const inputColor = () => {
  if (localStorage.getItem('eventsColor') === null) return;
  colorInput.value = JSON.parse(localStorage.getItem('eventsColor'));
};

// function changing the color of the events displayed in the calendar
export const setColor = () => {
  const events = document.querySelectorAll('.event');
  [...events].forEach(event => {
    try {
      event.style.background = JSON.parse(localStorage.getItem('eventsColor'));
    } catch {
      event.style.background = localStorage.getItem('eventsColor');
    }
  });
};

