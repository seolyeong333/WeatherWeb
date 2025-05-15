// ✅ MainPage.jsx
// 메인 날씨 페이지: 전체 날씨 UI 렌더링 + 날씨에 따른 배경 애니메이션 및 테스트 모드 제공

import Header from "../components/Header";
import WeatherBox from "../components/WeatherBox";
import MapSection from "../components/MapSection";
import NationalWeatherFetcher from "../components/NationalWeatherFetcher";
import WeeklyForecast from "../components/WeeklyForecast";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MainPage.css";

// 테스트용 날씨 시퀀스 (🧪 버튼 클릭 시 순환)
const testWeatherSequence = ["맑음", "흐림", "비", "뇌우", "눈"];

function MainPage() {
  // 전국 날씨 데이터 (지도용)
  const [nationalWeatherData, setNationalWeatherData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // 날씨 상태 - 실제 날씨 or 테스트 시 상태 반영
  const [isRainy, setIsRainy] = useState(false);
  const [isSunny, setIsSunny] = useState(false);
  const [isCloudy, setIsCloudy] = useState(false);
  const [isSnowy, setIsSnowy] = useState(false);
  const [isThunder, setIsThunder] = useState(false);

  // 테스트 모드 설정
  const [testIndex, setTestIndex] = useState(0);          // 현재 테스트 중인 날씨 index
  const [isTestMode, setIsTestMode] = useState(true);     // 테스트 모드 ON/OFF

  // overrideWeather: 테스트 모드일 경우만 값이 설정됨
  const overrideWeather = isTestMode ? testWeatherSequence[testIndex] : null;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      alert("소셜 로그인 성공!");
      navigate("/main", { replace: true });  // URL에서 token 제거
    }
  }, [location, navigate]);

  // 🌧️ 비 / 천둥일 경우 비 애니메이션 생성
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

  // ❄️ 눈 애니메이션 생성
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

  // 현재 날씨 상태를 이모지로 표현 (화면 하단용)
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
      {/* 배경 오버레이 (조건부 렌더링) */}
      {(isRainy || isThunder) && <div id="rain-overlay" className="rain-overlay" />}
      {isSnowy && <div id="snow-overlay" className="snow-overlay" />}
      {isSunny && <div className="weather-sunny-overlay" />}
      {isCloudy && <div className="weather-cloudy-overlay" />}
      {isThunder && <div className="weather-thunder-overlay" />}

      <Header />

      {/* 전국 날씨 지도용 데이터 fetch */}
      <NationalWeatherFetcher setNationalWeatherData={setNationalWeatherData} />

      {/* 메인 날씨 + 지도 + 예보 영역 */}
      <main className={`
        main-content 
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
              overrideWeather={overrideWeather}  // 테스트 모드일 경우 전달
            />
          </div>
          <div className="map-box box-shadow">
            <MapSection weatherData={nationalWeatherData} />
          </div>
        </section>

        {/* 📆 주간 예보 */}
        <section className="forecast-section box-shadow">
          <WeeklyForecast />
        </section>

        {/* 🧪 테스트 토글 버튼 UI */}
        <div className="text-center mt-4">
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => setIsTestMode(prev => !prev)}
          >
            {isTestMode ? "🔁 실제 날씨 보기" : "🧪 테스트 모드 보기"}
          </button>

          {isTestMode && (
            <>
              <button
                className="btn btn-outline-dark"
                onClick={() => setTestIndex((prev) => (prev + 1) % testWeatherSequence.length)}
              >
                날씨 테스트 토글 ({overrideWeather})
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
