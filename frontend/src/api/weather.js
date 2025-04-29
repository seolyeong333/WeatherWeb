// ✅ weather.js
// 역할: 백엔드(Spring Boot 서버)로 API 요청을 보내는 함수들을 정리한 파일

import axios from "axios"; // HTTP 요청을 보내기 위한 라이브러리

// 🌟 백엔드 서버 주소
const BASE_URL = "http://localhost:8080/api/weather";

// 🌟 현재 날씨 정보를 가져오는 함수
export const getCurrentWeather = (lat, lon) =>
  axios.get(`${BASE_URL}/current`, { params: { lat, lon } });

// 🌟 공기질(Air Pollution) 정보를 가져오는 함수
export const getAirPollution = (lat, lon) =>
  axios.get(`${BASE_URL}/air`, { params: { lat, lon } });

// 🌟 5일 예보(3시간 간격) 데이터를 가져오는 함수
export const getForecast = (lat, lon) =>
  axios.get(`${BASE_URL}/forecast`, { params: { lat, lon } });
