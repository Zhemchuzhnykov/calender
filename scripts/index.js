import { initNavigation, returnToCurrentWeek } from './header/navigation.js';
import { renderHeader } from './calendar/header.js';
import { renderTimescale } from './calendar/timescale.js';
import { renderWeek, renderCurrentTimeIndicator } from './calendar/calendar.js';
import { renderEvents, onDeleteEvent, handleEventClick } from './events/events.js';
import { addDateTime, openModal, closeModal, closeFormWithExternalClick, openEventEditor } from './common/modal.js';
import { onClickOnCreateBtn, initEventForm } from './events/createEvent.js';
import { shortVerticalLines, rightAnimatedLine, leftAnimatedLine, captureOfDynamicElements, 
  changedLeftLine, changedRightLine, fixElemWhenScrolled } from './dynamic/dynamic.js';

// to initiate storage items if the local storage is empty
if (localStorage.getItem('events') === null) {
  localStorage.setItem('eventIdToDelete', JSON.stringify(null));
  localStorage.setItem('displayedWeekStart', JSON.stringify(null));
  localStorage.setItem('events', JSON.stringify([]));
};

// rendering of all calendar sections, renewal of the sections
initNavigation();
renderHeader();
renderTimescale();
renderWeek();
renderEvents();
renderCurrentTimeIndicator();
setInterval(renderCurrentTimeIndicator, 60000); // to renew the current time line every minute
addDateTime(new Date(), null);
captureOfDynamicElements(); // captures dynamic elements when a layout is re-drawn for correct display upon scroll

// elements against which event handlers are applied
const createButton = document.querySelector('.create-event-btn');
const closeEventFormButton = document.querySelector('.create-event__close-btn');
const eventForm = document.querySelector('.event-form');
const navElem = document.querySelector('.navigation');
const todayButton = document.querySelector('.navigation__today-btn');
const calendarTimeSlots = document.querySelector('.calendar__week');
const deleteButtonContainer = document.querySelector('.popup');
const deleteEventButton = document.querySelector('.popup__content');
const createEditEventForm = document.querySelector('.modal');

// event listeners for users' actions, and tab navigation
calendarTimeSlots.addEventListener('click', openModal);
calendarTimeSlots.addEventListener('click', handleEventClick);
window.addEventListener('dblclick', openEventEditor);
window.addEventListener('mousedown', closeFormWithExternalClick);
createButton.addEventListener('click', onClickOnCreateBtn);
closeEventFormButton.addEventListener('click', closeModal);
eventForm.addEventListener('submit', initEventForm);
navElem.addEventListener('click', captureOfDynamicElements);
todayButton.addEventListener('click', returnToCurrentWeek);
deleteEventButton.addEventListener('click', onDeleteEvent);
window.addEventListener('scroll', changedLeftLine); // animating left timezone line
window.addEventListener('scroll', changedRightLine); // animating sunday bottom line
window.addEventListener('scroll', fixElemWhenScrolled); // retains positions of elements when a page is scrolled
window.addEventListener('storage', renderEvents);