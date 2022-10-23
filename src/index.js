import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import refs from './js/refs';
import lD from './js/local-data';
import { updateCityInfo, updateWeather } from './js/city-info';
import { updateTimers } from './js/timers';

init();
updateCityInfo();
updateTimers();
localIimer();

// const closePostCard_ID = setTimeout(closePostCard, 30000);
refs.Card.addEventListener('click', closePostCard);

function init() {
  const date = new Date();
  lD.TIME_NOW = date.getTime();
  lD.LOCAL_TIME_ZONE = date.getTimezoneOffset() * -60;
  const optionsFP = {
    enableTime: true,
    time_24hr: true,
    // dateFormat: 'd-m-Y H:i',
    defaultDate: lD.TIME_NOW,
    minDate: 'today',
    minuteIncrement: 1,
    onClose(selectedDates) {
      handleDataFP(selectedDates[0].getTime());
    },
  };

  const savedTime = localStorage.getItem(lD.STORAGE_KEY_TIME);
  if (savedTime) {
    optionsFP.defaultDate = Number(savedTime);
  } else {
    optionsFP.defaultDate = new Date(lD.DEPARTURE_DATE).getTime();
    localStorage.setItem(lD.STORAGE_KEY_TIME, optionsFP.defaultDate);
  }
  lD.TIME_LEFT = optionsFP.defaultDate + 1000 - lD.TIME_NOW;
  flatpickr('.date-departure-input', optionsFP);
}

function localIimer() {
  clearInterval(lD.LOCAL_TIMER_ID);
  lD.LOCAL_TIMER_ID = setInterval(() => {
    lD.TIME_NOW += 1000;
    lD.TIME_LEFT -= 1000;
  }, 1000);
}

function handleDataFP(time) {
  localStorage.setItem(lD.STORAGE_KEY_TIME, time);
  lD.TIME_LEFT = time + 1000 - lD.TIME_NOW;
}

function closePostCard() {
  clearTimeout(closePostCard_ID);
  refs.Hero.classList.remove('is-hidden');
  refs.PostCard.classList.add('hide-it');
}
