import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import SocialSignup from "./SocialSignup"; 
import Header from "../components/Header";
import MapSection from "../components/MapSection";
import WeeklyForecast from "../components/WeeklyForecast";
import WeatherHeader from "../components/weather/WeatherHeader";
import HourlyWeatherChart from "../components/weather/HourlyWeatherChart";
import DailyWeatherChart from "../components/weather/DailyWeatherChart";
import AirPollutionChart from "../components/weather/AirPollutionChart";
import WeatherDetailSummary from "../components/weather/WeatherDetailSummary";
import { useLocation, useNavigate } from "react-router-dom";
import loadingAnimation from "../assets/loading.json";
import { fetchWeatherData } from "../api/fetchWeather";
import "../styles/TodayWeatherPage.css";

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

  const [showSocialSignup, setShowSocialSignup] = useState(false);
  const [socialInfo, setSocialInfo] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  // --- useEffect Hooks ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "socialSignup") {
      const email = params.get("email");
      const provider = params.get("provider");
      const nickname = params.get("nickname") || "";
      setSocialInfo({ email, provider, nickname });
      setShowSocialSignup(true);
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/", { replace: true });
      window.location.reload();
    }
  }, [location, navigate]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setCoord({ lat, lon });
      const data = await fetchWeatherData(lat, lon);
      setWeatherData(data);
      try {
        const airRes = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=4f673522ff69c4d615b1e593ce6fa16b`); // API 키
        setAirData(airRes.data);
      } catch (err) { console.error("🌫️ 미세먼지 예보 데이터 호출 실패:", err); }
      try {
        const res = await axios.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
          { headers: { Authorization: "KakaoAK e7c76873999ef901948568fdbf33233b" } }); // API 키
        if (res.data.documents.length > 0) {
          const region = res.data.documents[0];
          setRegionName(`${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`);
        }
      } catch (err) { console.error("📍 카카오 주소 변환 실패:", err); }
    });
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!weatherData || !airData) {
    return (
      <div className="loading-container">
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 150, height: 150 }} />
        <p>ONDA가 오늘의 하늘을 감지하는 중입니다…</p>
      </div>
    );
  }

  return (
    <div className="today-weather-page">
      {shouldShowRainAnimation && <div id="rain-overlay" className="rain-overlay"></div>}
      {shouldShowThunderFlash && <div className="weather-thunder-overlay"></div>}

      <Header />
      <WeatherHeader
        currentWeather={weatherData.current}
        hourlyPop={weatherData.hourly?.[0]?.pop}
        currentPollution={weatherData.pollution}
        regionName={regionName}
      />
      <WeatherDetailSummary dailySummary={weatherData.daily[0]} />
      <div className="chart-grid">
        <div className="chart-item">
          <div className="chart-title-wrapper">
          <h2 className="chart-title">시간별 날씨</h2>
          </div>
          <HourlyWeatherChart hourlyData={weatherData.hourly} />
        </div>

        <div className="chart-item">
          <div className="chart-title-wrapper">
          <h2 className="chart-title">지역별 날씨</h2>
          </div>
          {coord && <MapSection lat={coord.lat} lon={coord.lon} />}
        </div>
        <div className="chart-item"> 
          <div className="chart-title-wrapper">
            <h2 className="chart-title">주간 날씨</h2>
          </div>
            <DailyWeatherChart dailyData={weatherData.daily} />
        </div>
        <div className="chart-item"> 
          <div className="chart-title-wrapper">
            <h2 className="chart-title">미세먼지 예보 (PM2.5 / PM10)</h2>
          </div>
            <AirPollutionChart airPollutionData={airData} />
        </div>
        <div className="chart-item full-width"> <WeeklyForecast dailyData={weatherData.daily} /> </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '20px',
        marginTop: '30px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9'
      }}>
        <h4 style={{ marginBottom: '15px' }}>⚙️ 애니메이션 테스트 모드</h4>
        <button
          onClick={() => setIsTestModeEnabled(prev => !prev)}
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: isTestModeEnabled ? '#ffcdd2' : '#e0e0e0'
          }}
        >
          {isTestModeEnabled ? "테스트 모드 비활성화" : "테스트 모드 활성화"}
        </button>
        {isTestModeEnabled && (
          <>
            <button
              onClick={() => setForceRainInTestMode(prev => !prev)}
              style={{
                padding: '10px 15px',
                marginRight: '10px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: forceRainInTestMode ? '#c8e6c9' : '#e0e0e0'
              }}
            >
              {forceRainInTestMode ? "🌧️ 강제 비 중지" : "🌧️ 강제 비 시작"}
            </button>
            <button
              onClick={() => setForceThunderInTestMode(prev => !prev)}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: forceThunderInTestMode ? '#fff9c4' : '#e0e0e0'
              }}
            >
              {forceThunderInTestMode ? "⚡️ 강제 번개 중지" : "⚡️ 강제 번개 시작"}
            </button>
          </>
        )}
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>
          {isTestModeEnabled
            ? `테스트 모드: 비 ${forceRainInTestMode ? 'ON' : 'OFF'}, 번개 ${forceThunderInTestMode ? 'ON' : 'OFF'}`
            : "실제 날씨에 따라 애니메이션이 자동으로 표시됩니다."
          }
        </div>
      </div>
      
      {showSocialSignup && socialInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <SocialSignup
              email={socialInfo.email}
              provider={socialInfo.provider}
              nickname={socialInfo.nickname}
              onClose={() => {
                setShowSocialSignup(false);
                setSocialInfo(null);
              }}
            />
          </div>
        </div>
      )}

      {showScrollTopButton && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-button"
          aria-label="맨 위로 가기"
          title="맨 위로 가기"
        >
          {/* <FaArrowUp /> */}
          ↑
        </button>
      )}
    </div>
  );
}

export default TodayWeatherPage;