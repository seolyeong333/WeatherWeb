// ✅ src/pages/WeatherPage.jsx
// 역할: 사용자 위치 기반으로 OpenWeather API 호출 -> 현재 날씨 + 미세먼지(PM10), 초미세먼지(PM2.5) 표시

import { useEffect, useState } from "react";
import { getCurrentWeather, getAirPollution, getForecast } from "../api/weather";
import axios from "axios"; // 카카오 API 호출용

// 🌟 미세먼지(PM10) 수치에 따른 등급 반환 함수
function getPM10Grade(pm10) {
  if (pm10 <= 30) return { grade: "좋음", color: "blue" };
  if (pm10 <= 80) return { grade: "보통", color: "green" };
  if (pm10 <= 150) return { grade: "나쁨", color: "orange" };
  return { grade: "매우 나쁨", color: "red" };
}

// 🌟 초미세먼지(PM2.5) 수치에 따른 등급 반환 함수
function getPM25Grade(pm25) {
  if (pm25 <= 15) return { grade: "좋음", color: "blue" };
  if (pm25 <= 35) return { grade: "보통", color: "green" };
  if (pm25 <= 75) return { grade: "나쁨", color: "orange" };
  return { grade: "매우 나쁨", color: "red" };
}

function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [air, setAir] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState("");

  const KAKAO_REST_API_KEY = "e7c76873999ef901948568fdbf33233b";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      getCurrentWeather(latitude, longitude).then((res) => {
        setCurrent(res.data);
      });

      getAirPollution(latitude, longitude).then((res) => {
        setAir(res.data);
      });

      getForecast(latitude, longitude).then((res) => {
        setForecast(res.data.list.slice(0, 2)); // 6시간 예보
      });

      // 위치명 가져오기
      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
          {
            headers: { Authorization: `KakaoAK ${"e7c76873999ef901948568fdbf33233b"}` },
          }
        );
        if (response.data.documents.length > 0) {
          const region = response.data.documents[0];
          setLocation(`${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`);
        }
      } catch (error) {
        console.error("카카오 위치 변환 실패:", error);
      }
    });
  }, []);

  if (!current || !air || !forecast) return <div>Loading...</div>;

  // 🌟 아이콘
  const iconCode = current.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // 🌟 미세먼지/초미세먼지 데이터
  const pm10 = air.list[0].components.pm10;
  const pm25 = air.list[0].components.pm2_5;

  // 🌟 등급 계산
  const pm10Grade = getPM10Grade(pm10);
  const pm25Grade = getPM25Grade(pm25);

  return (
    <div style={{ padding: "20px" }}>
      {/* 위치 */}
      <h2>📍 현재 위치: {location}</h2>

      {/* 현재 날씨 */}
      <h2>🌤 현재 날씨</h2>
      <img src={iconUrl} alt="weather icon" />
      <p>기온: {current.main.temp}°C</p>
      <p>날씨: {current.weather[0].description}</p>

      {/* 공기질 */}
      <h2>🌫 공기질</h2>
      <div>
        <p>PM10(미세먼지) 농도: {pm10} μg/m³</p>
        <p style={{ color: pm10Grade.color }}>PM10 등급: {pm10Grade.grade}</p>
      </div>
      <div>
        <p>PM2.5(초미세먼지) 농도: {pm25} μg/m³</p>
        <p style={{ color: pm25Grade.color }}>PM2.5 등급: {pm25Grade.grade}</p>
      </div>

      {/* 6시간 예보 */}
      <h2>📅 6시간 예보</h2>
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
