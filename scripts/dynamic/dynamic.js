import { renderCurrentTimeIndicator } from '../calendar/calendar.js';
import { deleteButtonPlacement, deleteBtnWindowOffset } from '../events/events.js';
import { eventFormPlacement, eventFromWindowOffset } from '../common/modal.js';

// elements animating or changing location when a page is scrolled
export let shortVerticalLines, rightAnimatedLine, leftAnimatedLine;

// elements staying at their positions when a page is scrolled;
const deleteButtonContainer = document.querySelector('.popup');
const createEditEventForm = document.querySelector('.modal');
const deleteEventButton = document.querySelector('.popup__content');

export function captureOfDynamicElements() {
  shortVerticalLines = [...document.querySelectorAll('.short-vertical-line')];
  rightAnimatedLine = document.querySelector('.day-label:last-child > .day-label__downside-line');
  leftAnimatedLine = document.querySelector('.calendar__timezone-animated-line');

  if(scrollY !== 0) {
    leftAnimatedLine.classList.add('animated-left-line-long');
    rightAnimatedLine.classList.add('animated-right-line-short');
  };

  renderCurrentTimeIndicator();
};

/* to extend the left horizontal line at the section of the timezone when a page is scrolled down and to return it 
to the short state when the page is scrolled up
*/
export const changedLeftLine = () => {

  if (window.pageYOffset !== 0) {
    leftAnimatedLine.classList.remove('animated-left-line-short');
    leftAnimatedLine.classList.add('animated-left-line-long');
    return;
  };

    leftAnimatedLine.classList.remove('animated-left-line-long');
    leftAnimatedLine.classList.add('animated-left-line-short');
};

/* to shorten the right horizontal line at the section of Sunday when a page is scrolled down and to return it 
to the long state when the page is scrolled up
*/
export const changedRightLine = () => {
  if (window.pageYOffset !== 0) {
    rightAnimatedLine.classList.remove('animated-right-line-long');
    rightAnimatedLine.classList.add('animated-right-line-short');
    return;
  };

    rightAnimatedLine.classList.remove('animated-right-line-short');
    rightAnimatedLine.classList.add('animated-right-line-long');
};

/* sticking the short vertical lines to the header, sticking the delete button to its event, sticking 
the create-, edit-event form at the place where it is opened when a page is scrolled */
export function fixElemWhenScrolled(event) {

  // sticking the position of the short vertical line at the buttom of the calendar header
  let scroll_y = this.scrollY;
  const linePositionY = -46;
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
};