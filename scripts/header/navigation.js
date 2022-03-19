import { setItem } from '../common/storage.js';
import { renderWeek } from '../calendar/calendar.js';
import { renderHeader } from '../calendar/header.js';
import { getStartOfWeek, getDisplayedMonth } from '../common/time.utils.js';
import { shmoment } from '../common/shmoment.js';
import { renderEvents } from '../events/events.js';

const navElem = document.querySelector('.navigation');
const displayedMonthElem = document.querySelector('.navigation__displayed-month');
const buttonLeft = document.querySelector(`[data-direction = "prev"]`);
const buttonRight = document.querySelector(`[data-direction = "next"]`);

let weekStart = getStartOfWeek(new Date());

function renderCurrentMonth() {
  const currentMonth = getDisplayedMonth(getStartOfWeek(weekStart));
  displayedMonthElem.textContent = currentMonth;
};

// changes the display of a week/month with the navigation through weeks and renders updated dates and events
const onChangeWeek = (event) => {

  const calculatorFunction = shmoment(weekStart);

  if(event.target.closest('.icon-button') === buttonLeft) {
    const startOfPreviousWeek = calculatorFunction.subtract('days', 7);
    setItem('displayedWeekStart', startOfPreviousWeek.result());
    weekStart = startOfPreviousWeek.result();
  };

  if (event.target.closest('.icon-button') === buttonRight) {
    const startOfNextWeek = calculatorFunction.add('days', 7);
    setItem('displayedWeekStart', startOfNextWeek.result());
    weekStart = startOfNextWeek.result();
  };

  renderHeader();
  renderWeek();
  renderCurrentMonth();
  renderEvents();

};

// renders the current month/dates and handles the event of a click on the buttons of the week navigation
export const initNavigation = () => {
  renderCurrentMonth();
  navElem.addEventListener('click', onChangeWeek);
};

// returns to the current week after changing the calendar location through a week navigation
export const returnToCurrentWeek = () => {
  setItem('displayedWeekStart', getStartOfWeek(new Date()));
  weekStart = getStartOfWeek(new Date());
  renderHeader();
  renderWeek();
  renderCurrentMonth();
  renderEvents();
};
