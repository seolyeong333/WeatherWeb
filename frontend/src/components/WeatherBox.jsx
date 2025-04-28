import { useEffect, useState } from "react";
import { getCurrentWeather, getAirPollution, getForecast } from "../api/weather"; // 기존 날씨 API
import axios from "axios"; // 위치명 변환용

function WeatherBox() {
  const [location, setLocation] = useState(""); // 위치명
  const [current, setCurrent] = useState(null);  // 현재 날씨
  const [forecast, setForecast] = useState([]);  // 6시간 예보

  // 카카오 API 키
  const KAKAO_REST_API_KEY = "e7c76873999ef901948568fdbf33233b";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // 현재 날씨
      getCurrentWeather(latitude, longitude).then((res) => {
        setCurrent(res.data);
      });

      // 6시간 예보
      getForecast(latitude, longitude).then((res) => {
        setForecast(res.data.list.slice(0, 2));
      });

      // 위치명 가져오기 (카카오 API)
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

  if (!current || forecast.length === 0) return <div>Loading...</div>;

  const iconCode = current.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div style={{ fontSize: "16px", color: "#333" }}>
      <h3>📍 {location}</h3>
      <div>
        <img src={iconUrl} alt="weather" width="80" />
        <p>기온: {current.main.temp}°C</p>
        <p>날씨: {current.weather[0].description}</p>
      </div>
      <div>
        <h4>🕘 향후 6시간 예보</h4>
        {forecast.map((f, i) => (
          <p key={i}>
            {f.dt_txt} - {f.weather[0].description}, {f.main.temp}°C
          </p>
        ))}
      </div>
    </div>
  );
}

export default WeatherBox;
