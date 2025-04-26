import axios from "axios";

const BASE_URL = "http://localhost:8080/api/weather";

export const getCurrentWeather = (lat, lon) =>
  axios.get(`${BASE_URL}/current`, { params: { lat, lon } });

export const getAirPollution = (lat, lon) =>
  axios.get(`${BASE_URL}/air`, { params: { lat, lon } });

export const getForecast = (lat, lon) =>
  axios.get(`${BASE_URL}/forecast`, { params: { lat, lon } });
