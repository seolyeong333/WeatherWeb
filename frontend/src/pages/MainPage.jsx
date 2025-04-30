// ✅ src/pages/MainPage.jsx
import Header from "../components/Header";
import WeatherBox from "../components/WeatherBox";
import MapSection from "../components/MapSection";
import NationalWeatherFetcher from "../components/NationalWeatherFetcher";
import WeeklyForecast from "../components/WeeklyForecast";
import { useState } from "react";
import "./MainPage.css"; // ✅ 스타일 분리

function MainPage() {
  const [nationalWeatherData, setNationalWeatherData] = useState([]);

  return (
    <div className="main-container">
      <Header />
      <NationalWeatherFetcher setNationalWeatherData={setNationalWeatherData} />
      <main className="main-content">
        <section className="weather-map-section">
          <div className="weather-box box-shadow">
            <WeatherBox />
          </div>
          <div className="map-box box-shadow">
            <MapSection weatherData={nationalWeatherData} />
          </div>
        </section>
        <section className="forecast-section box-shadow">
          <WeeklyForecast />
        </section>
      </main>
    </div>
  );
}

export default MainPage;
