import { renderCurrentTimeIndicator } from '../calendar/calendar.js';

// elements animating or changing location when a page is scrolled
export let shortVerticalLines, rightAnimatedLine, leftAnimatedLine;

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