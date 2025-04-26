// ✅ WeatherPage.jsx
// 역할: 사용자 위치를 받아 OpenWeather API를 호출하고, 현재 날씨/공기질/6시간 예보 데이터를 화면에 표시하는 페이지

import { useEffect, useState } from "react"; // React Hook 사용 (상태 관리, 생명주기)
import {
  getCurrentWeather,
  getAirPollution,
  getForecast,
} from "../api/weather"; // API 요청 함수 가져오기

function WeatherPage() {
  // 🌟 상태(state) 선언: API 결과를 저장할 공간
  const [current, setCurrent] = useState(null); // 현재 날씨 정보
  const [air, setAir] = useState(null);         // 공기질 정보
  const [forecast, setForecast] = useState(null); // 6시간 날씨 예보 정보

  // 🌟 컴포넌트가 처음 렌더링될 때 자동 실행되는 useEffect 훅
  useEffect(() => {
    // 1. 브라우저에서 사용자의 위치(GPS) 받아오기
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords; // 위도, 경도 추출

      // 2. 받아온 위치(lat, lon)로 현재 날씨 데이터 요청
      getCurrentWeather(latitude, longitude)
        .then((res) => {
          setCurrent(res.data); // 결과를 current state에 저장
        });

      // 3. 받아온 위치(lat, lon)로 공기질 데이터 요청
      getAirPollution(latitude, longitude)
        .then((res) => {
          setAir(res.data); // 결과를 air state에 저장
        });

      // 4. 받아온 위치(lat, lon)로 5일 예보 데이터 요청
      getForecast(latitude, longitude)
        .then((res) => {
          // 5일 예보는 3시간 간격 데이터이므로
          // 6시간 예보만 쓸 거니까 앞에 2개 데이터만 잘라서 저장
          setForecast(res.data.list.slice(0, 2));
        });
    });
  }, []); // [] 빈 배열: 컴포넌트 "최초 1번"만 실행

  // 🌟 데이터가 아직 도착하지 않았을 때 로딩 표시
  if (!current || !air || !forecast) return <div>Loading...</div>;

  // 🌟 데이터가 다 준비됐으면 화면에 렌더링
  return (
    <div style={{ padding: "20px" }}>
      <h2>🌤 현재 날씨</h2>
      {/* 현재 기온과 날씨 설명 출력 */}
      <p>기온: {current.main.temp}°C</p>
      <p>날씨: {current.weather[0].description}</p>

      <h2>🌫 공기질</h2>
      {/* 공기질 정보 출력 (PM2.5, PM10) */}
      <p>PM2.5: {air.list[0].components.pm2_5} μg/m³</p>
      <p>PM10: {air.list[0].components.pm10} μg/m³</p>

      <h2>📅 6시간 예보</h2>
      {/* 6시간 예보 데이터 map 돌면서 출력 */}
      {forecast.map((f, i) => (
        <div key={i}>
          <p>
            {f.dt_txt} - {f.weather[0].description}, {f.main.temp}°C
          </p>
        </div>
      ))}
    </div>
  );
}

export default WeatherPage;
