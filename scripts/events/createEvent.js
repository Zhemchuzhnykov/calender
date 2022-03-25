import { getItem, setItem } from '../common/storage.js';
import { renderEvents } from './events.js';
import { getDateTime } from '../common/time.utils.js';
import { addDateTime, closeModal, filteredArray } from '../common/modal.js';
import { closePopup } from '../common/popup.js';

const createEventForm = document.querySelector('.modal');
const deleteButtonElement = document.querySelector('.popup');

// not to let the create-event form to be closed when an event does not pass a validation
let validated = true;

function clearEventForm() {
  [...document.querySelectorAll('.event-form__field')].map(field => {
    if (field.classList.contains('event-form__field_title') || field.classList.contains('event-form__field_description')) {
      field.value = '';
    }
    addDateTime(new Date());
  });
};

function eventValidator(checkedEvent) {
  // intersections of events
  const intersectionOfEvents = getItem('events').filter(event => {

    const intersectionBeforeFinished = new Date(checkedEvent.start).getTime() >= new Date(event.start).getTime() 
      && new Date(checkedEvent.start).getTime() < new Date(event.end).getTime() ? event: false;
    const intersectionAfterStarted = new Date(checkedEvent.end).getTime() > new Date(event.start).getTime() 
      && new Date(checkedEvent.end).getTime() < new Date(event.end).getTime() ? event: false;
    return intersectionBeforeFinished !== false || intersectionAfterStarted !== false;
  });

 if (intersectionOfEvents.length > 0 ) {
    alert('Two events cannot happen at the same time');
    validated = false;
    return;
  };

  // event no longer than 6 hours
  if((checkedEvent.end.getHours() * 60 + checkedEvent.end.getMinutes()) - (checkedEvent.start.getHours() * 60 + checkedEvent.start.getMinutes()) > 360) {
    alert('One event cannot last longer than 6 hours');
    validated = false;
    return;
  };

  // event no shorter than 15 minutes
  if ((checkedEvent.end.getHours() * 60 + checkedEvent.end.getMinutes()) - (checkedEvent.start.getHours() * 60 + checkedEvent.start.getMinutes()) < 15) {
    alert('An event cannot be shorter than 15 minutes');
    validated = false;
    return;
  };

  // event must contain a title
  if(checkedEvent.title.length === 0) {
    alert('An event should have a title');
    validated = false;
    return;
  };

  setItem('events', [...getItem('events'), checkedEvent]);
};

function onCreateEvent(event) {

  const [ title, date, startTime, endTime, description ] = [...event.target.querySelectorAll('.event-form__field')].
    map(field => field.value);

  const newEvent = {
    id: Math.random(),
    title,
    description,
    start: getDateTime(date, startTime),
    end: getDateTime(date, endTime),
  };

  eventValidator(newEvent);

  renderEvents();

  // to prevent the page from refreshing
  event.preventDefault();
};

// renders an event and resets the create-, edit-event form properties to default
export function initEventForm(event) {

  // to prevent the page from refreshing
  event.preventDefault();

  // if an event is submitted as an edited existing event, filteredArray is an updated list of events //
  if(createEventForm.classList.contains('edit-form')) setItem('events', filteredArray);
  onCreateEvent(event);
  // if an event has not passed the validation, the form remains opened
  if(validated) {
    clearEventForm();
    closeModal();
  };
  validated = true;
};

// displays and hides the create-event form after clicks on Create in navigation and close button on the form
export const onClickOnCreateBtn = () => {
   
  /* the button Create will close the create-, edit-event form or delete button if they are opened 
  when the button is clicked, and will not open a new instance of the create-event form*/
  if (!createEventForm.classList.contains('hidden') || !deleteButtonElement.classList.contains('hidden')) {
    closeModal();
    closePopup();
    return;
  };

  // to clear a form before opening
  closeModal();

  createEventForm.classList.remove('hidden');

  // for correct display of the create-event form when opened following the click on the button Create
  if (createEventForm.classList.contains('overlay')) {
    createEventForm.style.setProperty('z-index', `4`);
    createEventForm.style.setProperty('top', `${scrollY}px`);
  };
};