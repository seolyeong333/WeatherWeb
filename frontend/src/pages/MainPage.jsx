// ✅ src/pages/MainPage.jsx
import Header from "../components/Header";
import WeatherBox from "../components/WeatherBox";
import MapSection from "../components/MapSection";
import NationalWeatherFetcher from "../components/NationalWeatherFetcher";
import WeeklyForecast from "../components/WeeklyForecast";
import { useEffect, useState } from "react";
import "./MainPage.css";

const testWeatherSequence = ["맑음", "흐림", "비", "뇌우", "눈"];

function MainPage() {
  const [nationalWeatherData, setNationalWeatherData] = useState([]);
  const [isRainy, setIsRainy] = useState(false);
  const [isSunny, setIsSunny] = useState(false);
  const [isCloudy, setIsCloudy] = useState(false);
  const [isSnowy, setIsSnowy] = useState(false);
  const [isThunder, setIsThunder] = useState(false);
  const [testIndex, setTestIndex] = useState(0);

  const overrideWeather = testWeatherSequence[testIndex];

  // 💧 비/천둥
  useEffect(() => {
    const container = document.getElementById("rain-overlay");
    if ((isRainy || isThunder) && container) {
      container.innerHTML = "";
      for (let i = 0; i < 80; i++) {
        const drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random().toFixed(2)}s`;
        drop.style.animationDuration = `${0.8 + Math.random()}s`;
        container.appendChild(drop);
      }
    } else if (container) {
      container.innerHTML = "";
    }
  }, [isRainy, isThunder]);

  // ❄️ 눈
  useEffect(() => {
    const container = document.getElementById("snow-overlay");
    if (isSnowy && container) {
      container.innerHTML = "";
      for (let i = 0; i < 40; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.innerText = "❄";
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random().toFixed(2)}s`;
        flake.style.animationDuration = `${3 + Math.random() * 1.5}s`;
        const size = 6 + Math.random() * 3;
        flake.style.fontSize = `${size}px`;
        flake.style.opacity = `${0.08 + Math.random() * 0.05}`;
        container.appendChild(flake);
      }
    } else if (container) {
      container.innerHTML = "";
    }
  }, [isSnowy]);

  const getCurrentWeatherLabel = () => {
    if (isThunder) return "⛈️ 뇌우";
    if (isRainy) return "🌧️ 비";
    if (isSnowy) return "❄️ 눈";
    if (isCloudy) return "☁️ 흐림";
    if (isSunny) return "☀️ 맑음";
    return "⛅ 알 수 없음";
  };

  return (
    <div className="main-container">
      {(isRainy || isThunder) && <div id="rain-overlay" className="rain-overlay" />}
      {isSnowy && <div id="snow-overlay" className="snow-overlay" />}
      {isSunny && <div className="weather-sunny-overlay" />}
      {isCloudy && <div className="weather-cloudy-overlay" />}
      {isThunder && <div className="weather-thunder-overlay" />}

      <Header />
      <NationalWeatherFetcher setNationalWeatherData={setNationalWeatherData} />
      <main className={`main-content 
        ${isCloudy || isRainy ? "cloudy-background" : ""}
        ${isSunny ? "sunny-background" : ""}
        ${isThunder ? "thunder-background" : ""}
      `}>
        <section className="weather-map-section">
          <div className="weather-box box-shadow">
            <WeatherBox
              setIsRainy={setIsRainy}
              setIsSunny={setIsSunny}
              setIsCloudy={setIsCloudy}
              setIsSnowy={setIsSnowy}
              setIsThunder={setIsThunder}
              overrideWeather={overrideWeather}
            />
          </div>
          <div className="map-box box-shadow">
            <MapSection weatherData={nationalWeatherData} />
          </div>
        </section>
        <section className="forecast-section box-shadow">
          <WeeklyForecast />
        </section>

        {/* ✅ 테스트 토글 및 상태 표시 */}
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-dark"
            onClick={() => setTestIndex((prev) => (prev + 1) % testWeatherSequence.length)}
          >
            날씨 테스트 토글 ({overrideWeather})
          </button>
          <div className="mt-2">
            <strong>🌍 현재 적용된 날씨 효과:</strong> {getCurrentWeatherLabel()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
