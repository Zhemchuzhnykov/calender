const popupElem = document.querySelector('.popup');
const popupContentElem = document.querySelector('.popup__content');

// opens the delete event button at the place with passed coordinates
export function openPopup(x, y) {
  // the timeout to avoid a conflict with another function operating the class 'hidden' at the same time
  setTimeout(function() {
    popupElem.classList.remove('hidden')}, 100);

  popupContentElem.style.top = `${y}px`;
  popupContentElem.style.left = `${x}px`;
};

export function closePopup() {
  popupElem.classList.add('hidden');
};