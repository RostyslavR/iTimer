import { getWeather } from './weather-api';
import refs from './refs';
import lD from './local-data';
import debounce from 'debounce';
const DELAY = 3000;

export function updateCityInfo() {
  const savedDepCity = localStorage.getItem(lD.STORAGE_KEY_DEPARTURE);
  if (savedDepCity) {
    refs.DepartureCityInput.value = savedDepCity;
  } else {
    refs.DepartureCityInput.value = lD.DEPARTURE_CITY;
    saveCity(lD.STORAGE_KEY_DEPARTURE, refs.DepartureCityInput.value);
  }

  const savedArrCity = localStorage.getItem(lD.STORAGE_KEY_ARRIVAL);
  if (savedArrCity) {
    refs.ArrivalCityInput.value = savedArrCity;
  } else {
    refs.ArrivalCityInput.value = lD.ARRIVAL_CITY;
    saveCity(lD.STORAGE_KEY_ARRIVAL, refs.ArrivalCityInput.value);
  }

  refs.ArrivalCityInput.addEventListener(
    'input',
    debounce(handleCityInput, DELAY)
  );
  refs.DepartureCityInput.addEventListener(
    'input',
    debounce(handleCityInput, DELAY)
  );

  handleCityInfo();
}

function handleCityInput(evt) {
  evt.target.value = evt.target.value;
  saveCity(lD.STORAGE_KEY_DEPARTURE, refs.DepartureCityInput.value);
  saveCity(lD.STORAGE_KEY_ARRIVAL, refs.ArrivalCityInput.value);
  handleCityInfo();
}

function saveCity(key, city) {
  localStorage.setItem(key, city);
}

async function handleCityInfo() {
  const departureData = await getWeather(refs.DepartureCityInput.value);
  const arrivalData = await getWeather(refs.ArrivalCityInput.value);

  if (departureData.cod === 200) {
    lD.DEPARTURE_TIME_ZONE = departureData.timezone;
    refs.DepartureCityInput.value = `${departureData.name} ${departureData.sys.country}`;
    refs.DepartureCityInfo.innerHTML = makeMarkUp(departureData);
  } else {
    // refs.DepartureCityInput.value = 'Sorry';
    refs.DepartureCityInfo.innerHTML = `${departureData.message}`;
  }

  if (arrivalData.cod === 200) {
    lD.ARRIVAL_TIME_ZONE = arrivalData.timezone;
    refs.ArrivalCityInput.value = `${arrivalData.name} ${arrivalData.sys.country}`;
    refs.ArrivalCityInfo.innerHTML = makeMarkUp(arrivalData);
  } else {
    // refs.DepartureCityInput.value = 'Sorry';
    refs.ArrivalCityInfo.innerHTML = `${departureData.message}`;
  }
}

function makeMarkUp(data, nameInputId) {
  const { coord, weather, main, wind } = data;
  return `
  <p>&nbsp &nbsp &nbsp &nbsp &nbsp lon: ${coord.lon},   lat ${coord.lat}</p>
  <div class="wether">
    <div class="wether-pic">
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png"
        alt="${weather[0].description}" width="50px" heirht="50px">
    </div>  
    <p class="wether-temp">&nbsp  ${main.temp}°С </p>
  </div>
    <div class="wether-desc">
      <p>feels like: ${main.feels_like}°С, ${
    weather[0].description
  },</p><p> wind ${toTextualDescription(wind.deg)} ${wind.speed}m/s </p>
    </div>
`;
}

// function toQueryStr(str) {
//   //removes all spaces and inserts commas between words //
//   return str.trim().replace(/ {2,}/g, ' ').replace(/ /g, ',');
// }

function toTextualDescription(degree) {
  if (degree > 337.5) return 'Northerly';
  if (degree > 292.5) return 'North Westerly';
  if (degree > 247.5) return 'Westerly';
  if (degree > 202.5) return 'South Westerly';
  if (degree > 157.5) return 'Southerly';
  if (degree > 122.5) return 'South Easterly';
  if (degree > 67.5) return 'Easterly';
  if (degree > 22.5) {
    return 'North Easterly';
  }
  return 'Northerly';
}
