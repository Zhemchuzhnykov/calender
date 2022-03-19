import { getItem, setItem } from '../common/storage.js';
import { generateWeekRange } from '../common/time.utils.js';
import { renderEvents } from '../events/events.js';
import { createNumbersArray } from '../common/createNumbersArray.js';
import { getStartOfWeek, getDisplayedMonth } from '../common/time.utils.js';
import { removedEvent, filteredArray } from '../common/modal.js';

const createEditEventForm = document.querySelector('.modal');

// the function to generate time-slots inside a calendar day element
const generateDay = () => {

  const result = createNumbersArray(1, 24);

  return result.map(num => {
    
    let shortVerticalLine = '';
    let positionTop = '-46';
    if (window.scrollY !== 0) positionTop = (+positionTop + window.scrollY).toString();
    if (result.indexOf(num) === 0) shortVerticalLine = `<div class="short-vertical-line" style="top: ${positionTop}px;"></div>`;

    return `<div class="calendar__time-slot" data-time="${result.indexOf(num)}">${shortVerticalLine}</div>`
  })
  .join('');
};

// the function to generate weekday elements
export const renderWeek = () => {

  const currentWeekDays = document.querySelector('.calendar__week');

  // to delete old days elements because they are rendered again when a week navigation happens
  currentWeekDays.innerHTML = '';

  generateWeekRange(getItem('displayedWeekStart')).map(day => {
    currentWeekDays.innerHTML += `<div class="calendar__day" data-day="${day.getDate()}">${generateDay()}</div>`;
  });
};

// to dipslay the red line that indicates the current time
export const renderCurrentTimeIndicator = () => {

  const displayedMonth = document.querySelector('.navigation__displayed-month');
  
  // to clear the red line from the previous time slot when the line crosses the border
  [... document.querySelectorAll('.current-time-figure')].map(figure => figure.outerHTML = '');

  const currentDate = new Date().getDate();
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentDay = document.querySelector(`[data-day = "${currentDate}"]`);
  if (currentDay === null) return;
  const currentDayHour = currentDay.querySelector(`[data-time ="${currentHour}"]`);

  if (getDisplayedMonth(getStartOfWeek(new Date())) === displayedMonth.textContent) {
    currentDayHour.innerHTML = `<div class="current-time-figure"><div class="current-time-figure_circle"></div>
    <div class="current-time-figure_line"></div></div>`;
  };

  const currentTimeFigure = document.querySelector('.current-time-figure');
  // when the user is not on the current week;
  if (currentTimeFigure === null) return;
  // when the user is on the current week;
  currentTimeFigure.style.setProperty('top', `${currentMinute}px`);

  /* to avoid removing an edited event from the display when the current time indicator renews and renders events,
  and when the event-close button is clicked */
  if (removedEvent !== null && createEditEventForm.classList.contains('edit-form')) {
    setItem('events', [...filteredArray, ...removedEvent]);
  };

  // to avoid erasing an event at the time slot where the current time line is
  renderEvents();

  /* to avoid the change of the events list when it is rendered with the update of the current timeline and when
  the edit-event form is opened at the same time */
  if (removedEvent !== null && createEditEventForm.classList.contains('edit-form')) {
    setItem('events', filteredArray);
  };
};