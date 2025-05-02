// weather.js
// 역할: 백엔드(Spring Boot 서버)에 날씨 관련 데이터를 요청하는 함수들을 모아둔 파일

import axios from "axios"; // axios: HTTP 요청 라이브러리 (fetch보다 간편)

// 백엔드 API 주소 (로컬 환경 기준)
// 실제 배포할 땐 .env로 분리하는 게 좋음
const BASE_URL = "http://localhost:8080/api/weather";

/**
 * 현재 날씨 데이터를 가져옴
 * - 위도/경도를 기반으로 현재 기온, 날씨 상태 등을 받아옴
 * - 백엔드: /api/weather/current
 */
export const getCurrentWeather = (lat, lon) =>
  axios.get(`${BASE_URL}/current`, {
    params: { lat, lon }  // 쿼리스트링으로 위도/경도 전달됨
  });

/**
 * 공기질(미세먼지, 초미세먼지 등) 데이터를 가져옴
 * - 백엔드: /api/weather/air
 */
export const getAirPollution = (lat, lon) =>
  axios.get(`${BASE_URL}/air`, {
    params: { lat, lon }
  });

/**
 * 5일 예보 (3시간 간격) 데이터를 가져옴
 * - 최대 40개의 예보 데이터가 들어옴 (OpenWeather 기준)
 * - 백엔드: /api/weather/forecast
 */
export const getForecast = (lat, lon) =>
  axios.get(`${BASE_URL}/forecast`, {
    params: { lat, lon }
  });
