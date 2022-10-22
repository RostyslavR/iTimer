import refs from './refs';
import lD from './local-data';

export function updateTimers() {
  clearInterval(lD.UPDATE_TIMERS_ID);
  lD.UPDATE_TIMERS_ID = setInterval(handlerTimers, 1000);
}

function handlerTimers() {
  renderTime(lD.TIME_LEFT, refs.LeftTime, 'dhms');
  renderTime(lD.TIME_NOW, refs.LocalTime, 'date', lD.LOCAL_TIME_ZONE);
  renderTime(lD.TIME_NOW, refs.ArrivalCityTime, 'date', lD.ARRIVAL_TIME_ZONE);
  renderTime(
    lD.TIME_NOW,
    refs.DepartureCityTime,
    'date',
    lD.DEPARTURE_TIME_ZONE
  );
}

function renderTime(time, refernce, templ = 'hm', tz = 0) {
  time = time + tz * 1000;
  time < 1 && (time = 0);
  const { days, hours, minutes, seconds } = convertMs(time);
  let strigTime = "Can't show time ((";
  switch (templ) {
    case 'dhms':
      strigTime = `${days} : ${hours} : ${minutes} : ${seconds}`;
      break;
    case 'hms':
      strigTime = `${hours} : ${minutes} : ${seconds}`;
      break;
    case 'ms':
      strigTime = `${minutes} : ${seconds}`;
      break;
    case 'hm':
      strigTime = `${hours} : ${minutes}`;
      break;
    case 'date':
      strigTime = `${new Date(time - lD.LOCAL_TIME_ZONE * 1000).toDateString()} 
      ${hours} : ${minutes} : ${seconds} `;
      break;
    case 'time':
      strigTime = new Date(time).toTimeString();
      break;
  }
  refernce.innerHTML = strigTime;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );
  return { days, hours, minutes, seconds };
}

function addLeadingZero(value, bits = 2) {
  return String(value).padStart(bits, '0');
}
