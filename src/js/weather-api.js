// import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const ENDPOINT = 'weather?';
const API_KEY = '55c51d3aaafc0e33d04c280f371e572f';
const params = new URLSearchParams({
  appid: API_KEY,
  q: '',
  units: 'metric',
});

export async function getWeather(cityName) {
  params.set('q', strToQStr(cityName));
  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}${params}`);
    return response.json();
  } catch (err) {
    return { cod: 0, message: err };
  }
}

function strToQStr(str) {
  // replacing spaces between words with a comma (",") and removing all other spaces//
  return str.trim().replace(/ {2,}/g, ' ').replace(/ /g, ',');
}
