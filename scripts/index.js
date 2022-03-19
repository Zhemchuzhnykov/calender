import { initNavigation, returnToCurrentWeek } from './header/navigation.js';
import { renderHeader } from './calendar/header.js';
import { renderTimescale } from './calendar/timescale.js';
import { renderWeek, renderCurrentTimeIndicator } from './calendar/calendar.js';
import { renderEvents, onDeleteEvent, handleEventClick, deleteButtonPlacement, deleteBtnWindowOffset } from './events/events.js';
import { addDateTime, openModal, closeModal, closeModalWithExternalClick, openEventEditor, 
eventFormPlacement, eventFromWindowOffset } from './common/modal.js';
import { displayHideEventForm, initEventForm } from './events/createEvent.js';

// dynamic elements to be assigned after the render of the sections
let shortVerticalLines, linePositionY, rightAnimatedLine, leftAnimatedLine;

// rendering of all calendar sections, renewal of the sections
initNavigation();
renderHeader();
renderTimescale();
renderWeek();
renderEvents();
renderCurrentTimeIndicator();
setInterval(renderCurrentTimeIndicator, 60000);
addDateTime(new Date(), null);
captureOfDynamicElements();

/* for sticking the short vertical lines protruding from the calendar slots section to the header,
and for animating left and right lines of the calendar header (effect of a running line when scrolled) */
function captureOfDynamicElements() {
  shortVerticalLines = Array.from(document.querySelectorAll('.short-vertical-line'));
  rightAnimatedLine = document.querySelector('.day-label:last-child > .day-label__downside-line');
  leftAnimatedLine = document.querySelector('.calendar__timezone-animated-line');
  renderCurrentTimeIndicator();
};

// event listeners for users' clicks
const createButton = document.querySelector('.create-event-btn');
const closeEventFormButton = document.querySelector('.create-event__close-btn');
const eventForm = document.querySelector('.event-form');
const navElem = document.querySelector('.navigation');
const todayButton = document.querySelector('.navigation__today-btn');
const calendarTimeSlots = document.querySelector('.calendar__week');
const deleteButtonContainer = document.querySelector('.popup');
const deleteEventButton = document.querySelector('.popup__content');
const createEditEventForm = document.querySelector('.modal');

calendarTimeSlots.addEventListener('click', openModal);
calendarTimeSlots.addEventListener('click', handleEventClick);
window.addEventListener('dblclick', openEventEditor);
window.addEventListener('mousedown', closeModalWithExternalClick);
window.addEventListener('click', closeModalWithExternalClick);
createButton.addEventListener('click', displayHideEventForm);
closeEventFormButton.addEventListener('click', closeModal);
eventForm.addEventListener('submit', initEventForm);
navElem.addEventListener('click', captureOfDynamicElements);
todayButton.addEventListener('click', returnToCurrentWeek);
deleteEventButton.addEventListener('click', onDeleteEvent);

// animating left timezone line
const changedLeftLine = () => {
  if (window.pageYOffset !== 0) {
    leftAnimatedLine.classList.remove('animated-left-line-short');
    leftAnimatedLine.classList.add('animated-left-line-long');
    return;
  };

    leftAnimatedLine.classList.remove('animated-left-line-long');
    leftAnimatedLine.classList.add('animated-left-line-short');
};
window.addEventListener('scroll', changedLeftLine);

// animating sunday bottom line
const changedRightLine = () => {
  if (window.pageYOffset !== 0) {
    rightAnimatedLine.classList.remove('animated-right-line-long');
    rightAnimatedLine.classList.add('animated-right-line-short');
    return;
  };

    rightAnimatedLine.classList.remove('animated-right-line-short');
    rightAnimatedLine.classList.add('animated-right-line-long');
};

window.addEventListener('scroll', changedRightLine);

// sticking the position of the short vertical lines to the header and sticking the delete button to its event
window.addEventListener("scroll", function(event) {
  let scroll_y = this.scrollY;
  linePositionY = -46;
  let newElementPosition = linePositionY + scroll_y;
  shortVerticalLines.map(line => {
    line.style.setProperty('top', `${newElementPosition}px`);
  });

  // sticking the position of the delete button
  if (!deleteButtonContainer.classList.contains('hidden')) {
    const deleteBtnCalcValueOne = +deleteButtonPlacement + deleteBtnWindowOffset;
    const deleteBtnCalcValueTwo = +deleteButtonPlacement + scroll_y;
    const deleteBtnCalcDifference = deleteBtnCalcValueOne - deleteBtnCalcValueTwo;
    deleteEventButton.style.setProperty('top', `${+deleteButtonPlacement + deleteBtnCalcDifference}px`);
  };

  // sticking the position of the create- and edit-event form
  if (!createEditEventForm.classList.contains('hidden')) {
    const eventFormCalcValueOne = +eventFormPlacement + eventFromWindowOffset;
    const eventFormCalcValueTwo = +eventFormPlacement + scroll_y;
    const eventFormCalcDifference = eventFormCalcValueOne - eventFormCalcValueTwo;
    createEditEventForm.style.setProperty('top', `${+eventFormPlacement + eventFormCalcDifference}px`);
  };

  // sticking the position of the create-event form when it is opened by clicking the button Create
  if (createEditEventForm.classList.contains('overlay')) {
    createEditEventForm.style.setProperty('top', `${scroll_y}px`);
  };
});