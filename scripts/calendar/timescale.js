import { createNumbersArray } from '../common/createNumbersArray.js';

const timescaleContainer = document.querySelector('.calendar__time-scale');

// rendering time slots in the timescale panel
export const renderTimescale = () => {

  const timeScaleHours = createNumbersArray(1, 24);

  timescaleContainer.innerHTML = timeScaleHours.map(hour => {
  
  // for creating a short vertical line protruding from the calendar
  const startingHour = timeScaleHours.indexOf(hour) === 0 ? '<div class="short-vertical-line"></div>': '';

  // for correct display on the numbers in the timescale column
  let hourSlot = hour >= 10 ? `${hour}:00`: `0${hour}:00`;
  let shortHorizontalLine = '<div class="short-horizontal-line"></div>';

  // to avoid displaying the last hour (24:00) and its short vertical line
  if (timeScaleHours.indexOf(hour) === timeScaleHours.length - 1) {
    hourSlot = '';
    shortHorizontalLine = '';
  };

  return `<div class="time-slot">${startingHour}
    <span class="time-slot__time">${hourSlot}</span>
    ${shortHorizontalLine}
    </div>`;
  })
  .join('');
};

