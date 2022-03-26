import { getItem, setItem } from '../common/storage.js';
import { shmoment } from '../common/shmoment.js';
import { openPopup, closePopup } from '../common/popup.js';
import { setColor } from '../settings/color-change.js';

const deleteEventElement = document.querySelector('.popup');
const deleteEventButton = deleteEventElement.querySelector('.popup__content');
const modalElem = document.querySelector('.modal');

// for sticking the position of the delete button to a certain place on a screen when it is scrolled
export let deleteButtonPlacement = null;
export let deleteBtnWindowOffset = null;

// displays the delete event button
export function handleEventClick(event) {

  // any click (on the button or outside the button) will close the delete event button
  if (!deleteEventElement.classList.contains('hidden')) {
    closePopup();
    return;
  };

  // if the create-, edit-event form is opened, the delete button will not pop up (first, the form is closed)
  if (!modalElem.classList.contains('hidden')) return;

  // to continue the function only if an existing event is clicked
  const existingEvent = event.target.closest('.event');
  if (existingEvent === null) return;
  
  // to get all the details for the proper display of the delete event button
  const existingEventCoordinates = existingEvent.getBoundingClientRect();
  const existingEventHeight = existingEvent.style.height;
  const existingEventHeightValue = existingEventHeight.length === 5 ? existingEventHeight.slice(0,3):
   existingEventHeight.slice(0,2);

    // to develop different options how the delete button will be displayed depending on an event screen position
    let verticalAxisPosition = existingEventCoordinates.y + +existingEventHeightValue + 5;
    let horizontalAxisPosition = existingEventCoordinates.x + 150;
    if (existingEventCoordinates.bottom > 840) verticalAxisPosition = existingEventCoordinates.y - 55;
    if (window.innerWidth - existingEventCoordinates.right < 100) horizontalAxisPosition = existingEventCoordinates.x;

    // opens the delete event button with the passed coordinates
    openPopup(horizontalAxisPosition, verticalAxisPosition);

    // records an event to be deleted
    setItem('eventIdToDelete', existingEvent.dataset.eventId);
    
    // to deliver the coordinates to another function that will make the delete button move with a scroll
    let deletePosition =  deleteEventButton.style.top;
    deleteButtonPlacement = deletePosition.length >= 5 ? deletePosition.slice(0,3): deletePosition.slice(0,2);
    deleteBtnWindowOffset = scrollY;
};

// creates a DOM element of an event and adds to a DOM tree, displays it on a page
export const createEventElement = (event) => {

  // receives the date and hour of an event
  const eventDate = new Date(event.start).getDate();
  const eventHour = new Date(event.start).getHours();

  // for regulating the display of the event parts depending on the size/length of an event
  let eventDescription = '';
  let eventDescriptionShort = '';
  let eventTitleLong = '';

  // picks up a timeslot for an event
  const eventDay = document.querySelector(`[data-day = "${eventDate}"]`);
  const currentDayHour = eventDay.querySelector(`[data-time ="${eventHour}"]`);

  // creates an event element
  const eventElement = document.createElement('div');

  const eventDuration = ((new Date(event.end).getHours() * 60) + new Date(event.end).getMinutes()) - ((new Date(event.start).getHours() * 60) + new Date(event.start).getMinutes());

  const sizeDependantProperties = () => {
    let result = eventDuration <= 30 ? 'font-size: 11px; padding: 3px 10px 0px 10px; display: flex;': 
      'font-size: 14px; padding: 5px 10px 5px 10px;';
    if (eventDuration > 30 && eventDuration <= 45) result = 'font-size: 11px; padding: 5px 10px 0px 10px;';
    return result;
  };
  
  // to optimize the display of an event depending on its duration/size
  if (eventDuration < 120) eventDescriptionShort = 'event__description_short';
  if (eventDuration > 60 ) eventDescription = `<div class='event__description ${eventDescriptionShort}'>${event.description}</div>`;
  if (eventDuration > 120) eventTitleLong = 'event__title_long';

  const attributes = {
    'data-event-id': `${event.id}`,
    'class': 'event',
    'style': `top: ${new Date(event.start).getMinutes()}px; 
    height: ${eventDuration}px;
    ${sizeDependantProperties()}
    `,
  };

  Object.keys(attributes).map(key => { eventElement.setAttribute(`${key}`, `${attributes[key]}`) } );

  // to display time in a correct format hh:mm
  let startMinutesPrefix = '';
  let endMinutesPrefix = '';
  if (new Date(event.start).getMinutes() < 10) startMinutesPrefix = '0';
  if (new Date(event.end).getMinutes() < 10) endMinutesPrefix = '0';

  eventElement.innerHTML = `<div class="event__title ${eventTitleLong}">${event.title}</div>
  <div class ="event__time">${new Date(event.start).getHours()}:${startMinutesPrefix}${new Date(event.start).getMinutes()} - ${new Date(event.end).getHours()}:${endMinutesPrefix}${new Date(event.end).getMinutes()}</div>
  ${eventDescription}`;

  currentDayHour.append(eventElement);
};

// renders all the events to a web page
export const renderEvents = () => {

  if(getItem('events').length === 0) return;

  // to remove old events before rendering the event list with changes
  [...document.querySelectorAll('.event')].map(event => event.outerHTML = '');

  const thisWeekStartDay = getItem('displayedWeekStart');
  const calculatorFunction = shmoment(thisWeekStartDay);
  const endOfCurrentWeek = calculatorFunction.add('days', 7);

  const events = getItem('events').filter(event => {
    if (new Date(event.start).getTime() > new Date(thisWeekStartDay).getTime() 
      && new Date(event.end).getTime() < endOfCurrentWeek.result().getTime()) {
        return event;
    };
  })
  .map(event => { createEventElement(event)});
  setColor();
};

// removes an event from the events list and renders the updated events to a web page
export function onDeleteEvent() {

  const eventToDelete = getItem('eventIdToDelete');

  // validation of the event delete request
  const removedEvent = getItem('events').filter(event => event.id === +eventToDelete);
  const calculatorFunction = shmoment(removedEvent[0].start);
  const quarterHourBeforeEvent = calculatorFunction.subtract('minutes', 15).result();
  if(new Date() > quarterHourBeforeEvent && new Date() < removedEvent[0].start) {
    alert('Event cannot be removed when there is less than 15 minutes to the event start');
    closePopup();
    return;
  };

  const filteredEvents = getItem('events').filter(event => event.id !== +eventToDelete);
  setItem('events', filteredEvents);
  
  closePopup();
  renderEvents();
  
};