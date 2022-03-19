import { getItem, setItem } from './storage.js';
import { renderEvents } from '../events/events.js';
import { closePopup } from '../common/popup.js';

const modalElem = document.querySelector('.modal');
const editFormTitleElement = document.querySelector('.event-form__field_title');
const editFormDescriptionElement = document.querySelector('.event-form__field_description');
const editFormSubmitButton = document.querySelector('.event-form__submit-btn');
const editFormCloseButton = document.querySelector('.create-event__close-btn');
const deleteEventElement = document.querySelector('.popup');
export let removedEvent = null;
export let filteredArray = null;

// for changing the position of the create- or edit-event form when a page is scrolled up or down
export let eventFormPlacement = null;
export let eventFromWindowOffset = null;

// the function for adding a removed event back to the events list if a closure button of the edit-event form is clicked
const editFormClosure = () => {
  if (removedEvent !== null && modalElem.classList.contains('edit-form')) {
    setItem('events', [...filteredArray, ...removedEvent]);
    modalElem.classList.remove('edit-form');
    removedEvent = null;
    renderEvents();
  };
};

// adds time to the create-event form when it is called
export const addDateTime = (date, event) => {

  const dateInput = document.querySelector('.event-form__time_date');
  const startTimeInput = document.querySelector('.event-form__time_beginning');
  const endTimeInput = document.querySelector('.event-form__time_end');

  // adds a date to the create-event form
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const fullDate = date.getFullYear() + "-" + month + "-" + day;
  dateInput.value = fullDate;

  // formatter for the desired display of the time
  const formatter = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
 });
 
 // default time is the start/end of the hour of the clicked time slot or the start/end of the current hour
  let defaultEndTime = `${formatter.format(date.setHours(date.getHours() + 1)).slice(0,2)}:00`;
  let defaultStartTime = `${formatter.format(date.setHours(date.getHours() - 1)).slice(0,2)}:00`;
 
 // for avoiding the display of the edge time values 24:00 or 00:00
  if(defaultEndTime === '24:00') defaultEndTime = '23:59';
  if(defaultStartTime === '24:00') defaultStartTime = '00:01';
  
  startTimeInput.value = defaultStartTime;
  endTimeInput.value = defaultEndTime;

  /* When an existing event is clicked, the edit-event form is opened. The following instructions are 1) to display
  the form end time as the event end time instead of the default plus one hour from the start and 2) to display
  the minutes of the start of the event in the form instead of a default hour start*/
  if (event !== null && event !== undefined && event.type === 'dblclick') {
    const existingEventElement = event.target.closest('.event');
    const eventTime = existingEventElement.querySelector('.event__time');
    endTimeInput.value = eventTime.textContent.length === 11 ? `0${eventTime.textContent.slice(-4)}`: eventTime.textContent.slice(-5);
    startTimeInput.value = eventTime.textContent.length === 11 || eventTime.textContent.length === 12 ? `0${eventTime.textContent.slice(0, 4)}`: eventTime.textContent.slice(0, 5);
  }
};

// provides the correct date as an argument for the function addDateTime when an empty timeslot is clicked
const getTime = (event) => {

  const monthElement = document.querySelector('.navigation__displayed-month');
  const monthYear = monthElement.textContent;
  const clickedTimeSlot = event.target;
  const timeSlotDate = clickedTimeSlot.closest('.calendar__day');
  const dateToSet = timeSlotDate.dataset.day;

  /* to select a month correctly during a week that starts in one month and ends in the next month, and
  to select a year correctly during a week that starts in one year and ends in the next year */
  let monthToSet, yearToSet;
  const handlePeriodsIntersections = {
    '8': function() {
      monthToSet = monthYear.slice(0,3);
      yearToSet = monthYear.slice(-4);
    },
    '14': function() {
      if (dateToSet > 21) monthToSet = monthYear.slice(0,3);
      if (dateToSet < 8) monthToSet = monthYear.slice(6,9);
      yearToSet = monthYear.slice(-4);
    },
    '19': function() {
      monthToSet = monthYear.slice(11,14);
      yearToSet = monthYear.slice(-4);
      if (dateToSet > 21) {
        monthToSet = monthYear.slice(0,3);
        yearToSet = monthYear.slice(4,8);
      };
    }
  };
  handlePeriodsIntersections[monthYear.length]();

  let hourToSet = clickedTimeSlot.dataset.time;
  let minutesToSet = '00';

  // to assign a starting time of an existing event if an edit-event form is opened
  if (event.type === 'dblclick') {
    const openedEvent = clickedTimeSlot.closest('.event');
    const eventTimeElement = openedEvent.querySelector('.event__time');
    // for avoiding a time format error when an hour is single number
    hourToSet = eventTimeElement.textContent.slice(0,2).includes(':') ? `0${eventTimeElement.textContent.slice(0,1)}`: eventTimeElement.textContent.slice(0,2);
    minutesToSet = eventTimeElement.textContent.slice(3,5);
  };

  return (new Date(`${monthToSet} ${dateToSet}, ${yearToSet} ${hourToSet}:${minutesToSet}:00`));
};

// opens the create-event form
export const openModal = (event) => {

  /* The following instructions are to guarantee that when the create-event form, or edit-event form, or a delete button
  is already displayed, the click on a free timeslot or on an existing event will not open the create-event form
  at another place or will not display the delete button but will close the already opened form first  */
  if (!deleteEventElement.classList.contains('hidden') || !modalElem.classList.contains('hidden')) {
    modalElem.classList.add('hidden');
    // to avoid a conflict with another function called by a click at the same time that operates the class 'hidden'
    setTimeout(function() {
      closePopup();
    }, 101)
    return;
  };

  // not to open the create-event form if a single click is made against an existing event
  const singleClick = event.type === 'click' ? true: false;
  const clickTarget = event.target.closest('.event');
  if (clickTarget !== null && singleClick) return;

  // to reset the create-event fields from the previous calls of this form
  editFormTitleElement.value = '';
  editFormDescriptionElement.value = '';
  editFormSubmitButton.textContent = 'Create';

  modalElem.classList.remove('hidden');
  modalElem.classList.remove('overlay');

  // for displaying the form next to the clicked timeslot
  const elementCoordinates = event.target.getBoundingClientRect();
  const coordinateY = elementCoordinates.y > 410 ? elementCoordinates.y - 240: elementCoordinates.y + 15;
  const coordinateX = elementCoordinates.x > 1120 ? elementCoordinates.x - 200: elementCoordinates.x + 15;
  modalElem.style.top = `${coordinateY}px`;
  modalElem.style.left = `${coordinateX}px`;

  addDateTime(getTime(event), event);

  /* Data required for changing the position of the create- or edit-event form when a page is scrolled up or down
  in another function */
  eventFormPlacement = coordinateY;
  eventFromWindowOffset = scrollY;
};

// opens the edit-event form
export const openEventEditor = (event) => {

  const eventElement = event.target.closest('.event');
  if (eventElement === null) return;

  openModal(event);
  setTimeout(function() {
    closePopup();
  }, 100);

  // to add the information from the event to the edit form
  const titleElement = eventElement.querySelector('.event__title');
  const descriptionElement = eventElement.querySelector('.event__description');
  editFormTitleElement.value = titleElement.textContent;
  if (descriptionElement !== null) editFormDescriptionElement.value = descriptionElement.textContent;
  editFormSubmitButton.textContent = 'Update';
  
  /* to deliver the value of the removed event and updated events list to other functions for correct updates of the
  events list after executation of these functions. The event is deleted in order to prevent the event validator
  from blocking the edited event to be added (added as a new event) */
  const existingEvents = getItem('events');
  filteredArray = existingEvents.filter(event => titleElement.textContent !== event.title);
  removedEvent = existingEvents.filter(event => titleElement.textContent === event.title);
  setItem('events', filteredArray);

  /* the class allows managing the display of the edit-event form when the form should be hidden with an external
  click, click on the closure button, or submitting a form */
  modalElem.classList.add('edit-form');

  // the removed event is added back if a closure button of the form is clicked
  editFormCloseButton.addEventListener('click', editFormClosure);
};

// to reset the create-event form to the default state after different manipulations
export const closeModal = () => {
  modalElem.classList.add('hidden');
  modalElem.classList.add('overlay');
  modalElem.style.left = '';
  modalElem.style.margin = 'auto';
  editFormTitleElement.value = '';
  editFormDescriptionElement.value = '';
  addDateTime(new Date());
  /* the timeout helps avoid a conflict with the function editFormClosure launched by the same event and operating
  the class 'edit-form' */
  setTimeout(function() {
    modalElem.classList.remove('edit-form');
  }, 1)
};

/* if the create-, or edit-event form, or delete button is opened, an external click (a click at any place in the 
  intuitively expected area) will, first, close the opened form/button and ignore calling opening at the clicked place */
export const closeFormWithExternalClick = (event) => {
  // closes the create-event form when it is opened with the click on the button Create in the navigation
  if(event.target === modalElem) modalElem.classList.add('hidden');
  
// not to change list of events if the edit-event form's not submitted and external click closes the edit-event form
  const externalClick = event.target.closest('.modal');
  if(externalClick === null && modalElem.classList.contains('edit-form')) {
    setItem('events', [...filteredArray, ...removedEvent]);
    removedEvent = null;
    modalElem.classList.remove('edit-form');
  };
};