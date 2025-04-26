import { useEffect, useState } from "react";
import {
  getCurrentWeather,
  getAirPollution,
  getForecast,
} from "../api/weather";

function WeatherPage() {
  const [current, setCurrent] = useState(null);
  const [air, setAir] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      getCurrentWeather(latitude, longitude).then((res) => {
        setCurrent(res.data);
      });

      getAirPollution(latitude, longitude).then((res) => {
        setAir(res.data);
      });

      getForecast(latitude, longitude).then((res) => {
        // 6시간치만 추출 (3시간 간격 데이터 → 2개)
        setForecast(res.data.list.slice(0, 2));
      });
    });
  }, []);

  if (!current || !air || !forecast) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌤 현재 날씨</h2>
      <p>기온: {current.main.temp}°C</p>
      <p>날씨: {current.weather[0].description}</p>

      <h2>🌫 공기질</h2>
      <p>PM2.5: {air.list[0].components.pm2_5} μg/m³</p>
      <p>PM10: {air.list[0].components.pm10} μg/m³</p>

      <h2>📅 예보 (6시간)</h2>
      {forecast.map((f, i) => (
        <div key={i}>
          <p>{f.dt_txt} - {f.weather[0].description}, {f.main.temp}°C</p>
        </div>
      ))}
    </div>
  );
}

export default WeatherPage;
