import { getItem, setItem } from '../common/storage.js';
import { generateWeekRange, getStartOfWeek } from '../common/time.utils.js';

const calendarHeader = document.querySelector('.calendar__header');

export const renderHeader = () => {

  // in order to dipslay a correct week when navigating through weeks
  if (getItem('displayedWeekStart') === null) {
  setItem('displayedWeekStart', getStartOfWeek(new Date()));
  };

  // adding the section with the time zone
  calendarHeader.innerHTML = `<div class="calendar__timezone">${new Date().toTimeString().slice(9, 15)}
  <div class="calendar__timezone-animated-line"></div></div>`;

  const formatter = Intl.DateTimeFormat('en-us', { weekday: 'short' }).format;

  calendarHeader.innerHTML += generateWeekRange(getItem('displayedWeekStart'))
  .map(day => {

    // for highlighting the current day
    const todayWeekday = formatter(day) === formatter(new Date()) && day.getDate() === new Date().getDate() ? 'day-label__day-name_today': '';
    const todayDate = day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() ? 'day-label__day-number_today': '';

    return `<div class="calendar__day-label day-label">
    <span class="day-label__day-name ${todayWeekday}">${formatter(day)}</span>
    <span class="day-label__day-number ${todayDate}">${day.getDate()}</span>
    <span class="day-label__downside-line"></span>
    </div>
    `
  })
  .join('');
};