import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ Hooks for routing
import axios from "axios";
import Lottie from "lottie-react";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
// framer-motion은 Header의 로그인 모달에만 사용되므로 여기서는 SocialSignup 모달에 직접 사용하지 않는다고 가정합니다.
// 만약 SocialSignup 모달도 동일한 framer-motion 효과를 원하시면 추가할 수 있습니다.

import Header from "../components/Header";
import MapSection from "../components/MapSection";
import WeeklyForecast from "../components/WeeklyForecast";
import WeatherHeader from "../components/weather/WeatherHeader";
import HourlyWeatherChart from "../components/weather/HourlyWeatherChart";
import DailyWeatherChart from "../components/weather/DailyWeatherChart";
import AirPollutionChart from "../components/weather/AirPollutionChart";
import WeatherDetailSummary from "../components/weather/WeatherDetailSummary";
import SocialSignup from "../pages/SocialSignup"; // ✅ SocialSignup 컴포넌트 경로를 확인하고 정확하게 수정해주세요.

import loadingAnimation from "../assets/loading.json";
import { fetchWeatherData } from "../api/fetchWeather";
import "../styles/TodayWeatherPage.css";
// import "../styles/Mainpage.css"; // 만약 Mainpage.css의 modal-overlay, modal-content 스타일을 사용한다면 import

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ChartDataLabels);

function TodayWeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [coord, setCoord] = useState(null);
  const [regionName, setRegionName] = useState("");
  const [airData, setAirData] = useState(null);

  const [shouldShowRainAnimation, setShouldShowRainAnimation] = useState(false);
  const [shouldShowThunderFlash, setShouldShowThunderFlash] = useState(false);

  const [isTestModeEnabled, setIsTestModeEnabled] = useState(false);
  const [forceRainInTestMode, setForceRainInTestMode] = useState(false);
  const [forceThunderInTestMode, setForceThunderInTestMode] = useState(false);

  // ✅ 소셜 로그인/회원가입 관련 상태 (MainPage.jsx 에서 가져옴)
  const [showSocialSignup, setShowSocialSignup] = useState(false);
  const [socialInfo, setSocialInfo] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // --- 데이터 가져오기 useEffect ---
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setCoord({ lat, lon });
      const data = await fetchWeatherData(lat, lon);
      setWeatherData(data);
      // API 호출 및 상태 설정 (기존과 동일)
      try {
        const airRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=4f673522ff69c4d615b1e593ce6fa16b` // API 키
        );
        setAirData(airRes.data);
      } catch (err) { console.error("🌫️ 미세먼지 예보 데이터 호출 실패:", err); }
      try {
        const res = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
          { headers: { Authorization: "KakaoAK e7c76873999ef901948568fdbf33233b" } } // API 키
        );
        if (res.data.documents.length > 0) {
          const region = res.data.documents[0];
          setRegionName(`${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`);
        }
      } catch (err) { console.error("📍 카카오 주소 변환 실패:", err); }
    });
  }, []);

  // --- 애니메이션 관련 useEffects --- (기존과 동일)
  useEffect(() => {
    if (isTestModeEnabled) {
      setShouldShowRainAnimation(forceRainInTestMode);
      setShouldShowThunderFlash(forceThunderInTestMode);
    } else {
      let showRain = false; let showThunder = false;
      if (weatherData?.current?.weather?.[0]) {
        const condition = weatherData.current.weather[0];
        const main = condition.main.toLowerCase();
        const iconGroup = condition.icon.substring(0, 2);
        if (main.includes("thunderstorm") || iconGroup === "11") {
          showThunder = true; showRain = true;
        } else if (main.includes("rain") || main.includes("drizzle") || iconGroup === "10" || iconGroup === "09") {
          showRain = true;
        }
      }
      setShouldShowRainAnimation(showRain); setShouldShowThunderFlash(showThunder);
    }
  }, [weatherData, isTestModeEnabled, forceRainInTestMode, forceThunderInTestMode]);

  useEffect(() => {
    const container = document.getElementById("rain-overlay");
    if (shouldShowRainAnimation && container) {
      container.innerHTML = ""; const numRaindrops = 80;
      for (let i = 0; i < numRaindrops; i++) {
        const drop = document.createElement("div"); drop.className = "raindrop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random().toFixed(2)}s`;
        drop.style.animationDuration = `${(0.8 + Math.random()).toFixed(2)}s`;
        container.appendChild(drop);
      }
    } else if (container) { container.innerHTML = ""; }
  }, [shouldShowRainAnimation]);

  // ✅ 소셜 로그인/회원가입 URL 파라미터 처리 useEffects (MainPage.jsx 에서 가져와서 경로 수정)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "socialSignup") {
      const email = params.get("email");
      const provider = params.get("provider");
      const nickname = params.get("nickname") || "";
      setSocialInfo({ email, provider, nickname });
      setShowSocialSignup(true);
      navigate("/", { replace: true }); // URL에서 파라미터 제거 (현재 페이지가 홈이므로 "/"로)
    }
  }, [location, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // alert("소셜 로그인 성공!"); // 사용자 경험을 위해 alert 대신 다른 피드백 고려
      navigate("/", { replace: true }); // URL에서 token 제거 (현재 페이지가 홈이므로 "/"로)
      // Header의 로그인 상태를 즉시 반영하기 위해, Header가 localStorage를 구독하거나
      // App 레벨에서 로그인 상태를 관리하고 prop으로 내려주거나, Context API 등을 사용해야 합니다.
      // 가장 간단한 방법은 페이지를 새로고침하여 Header가 새 토큰을 읽게 하는 것입니다.
      window.location.reload(); // 로그인 상태를 헤더에 즉시 반영 (다른 상태관리 없을 시)
    }
  }, [location, navigate]);
  // ----------------------------------------------------------------------

  if (!weatherData || !airData) { /* 로딩 UI */ }

  return (
    <div className="today-weather-page">
      {shouldShowRainAnimation && <div id="rain-overlay" className="rain-overlay"></div>}
      {shouldShowThunderFlash && <div className="weather-thunder-overlay"></div>}

      <Header /> {/* Header는 자체 로그인 모달(Login.jsx)을 가짐 */}

      <WeatherHeader /* ...props... */ />
      <WeatherDetailSummary /* ...props... */ />
      <div className="chart-grid"> /* ...차트들... */ </div>
      <div style={{ /* ...테스트 모드 UI 스타일... */ }}> /* ...테스트 모드 UI... */ </div>

      {/* ✅ SocialSignup 모달 (MainPage.jsx 구조 사용) */}
      {showSocialSignup && socialInfo && (
        // 이 modal-overlay와 modal-content 클래스는 Mainpage.css 또는 공용 CSS에 정의되어 있어야 합니다.
        <div className="modal-overlay">
          <div className="modal-content">
            <SocialSignup
              email={socialInfo.email}
              provider={socialInfo.provider}
              nickname={socialInfo.nickname}
              onClose={() => {
                setShowSocialSignup(false);
                setSocialInfo(null); // 소셜 정보 초기화
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TodayWeatherPage;