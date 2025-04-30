import { useEffect, useState } from "react";
import { getCurrentWeather, getAirPollution, getForecast } from "../api/weather";
import axios from "axios";
import { getKoreanWeatherDescription } from "../api/weatherMapping";

// 현실 기반 색상 매핑
const weatherColorClassMap = {
  "맑음": "bg-primary-subtle",        // 하늘색
  "흐림": "bg-secondary-subtle",      // 회색
  "구름 많음": "bg-body-tertiary",    // 옅은 회색
  "비": "bg-info-subtle",             // 파란색
  "소나기": "bg-info-subtle",
  "눈": "bg-light",                   // 흰색
  "뇌우": "bg-dark-subtle",           // 어두운 회색
  "안개": "bg-light-subtle",
  "연무": "bg-light-subtle",
};

function WeatherBox() {
  const [location, setLocation] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [air, setAir] = useState(null);

  const KAKAO_REST_API_KEY = "e7c76873999ef901948568fdbf33233b";

  const getCardColorClass = (desc) => weatherColorClassMap[desc] || "bg-light";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      getCurrentWeather(latitude, longitude).then((res) => setCurrent(res.data));

      getForecast(latitude, longitude).then((res) => {
        const now = new Date();
        const upcoming = res.data.list.filter((item) => {
          const forecastTime = new Date(item.dt_txt);
          return forecastTime > now;
        }).slice(0, 2);
        setForecast(upcoming);
      });

      getAirPollution(latitude, longitude).then((res) => setAir(res.data.list[0].components));

      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
          {
            headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
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
  const currentDesc = getKoreanWeatherDescription(current.weather[0].description);
  const currentCardClass = getCardColorClass(currentDesc);

  const getAirGrade = (pm, type) => {
    if (type === "pm10") {
      if (pm <= 30) return { label: "좋음", color: "success", border: "border-success" };
      if (pm <= 80) return { label: "보통", color: "warning", border: "border-warning" };
      if (pm <= 150) return { label: "나쁨", color: "danger", border: "border-danger" };
      return { label: "매우 나쁨", color: "dark", border: "border-dark" };
    } else {
      if (pm <= 15) return { label: "좋음", color: "success", border: "border-success" };
      if (pm <= 35) return { label: "보통", color: "warning", border: "border-warning" };
      if (pm <= 75) return { label: "나쁨", color: "danger", border: "border-danger" };
      return { label: "매우 나쁨", color: "dark", border: "border-dark" };
    }
  };

  const pm10 = air?.pm10;
  const pm25 = air?.pm2_5;
  const pm10Grade = getAirGrade(pm10, "pm10");
  const pm25Grade = getAirGrade(pm25, "pm25");

  return (
    <div className="container">
      {/* 현재 날씨 */}
      <div className={`card mb-4 ${currentCardClass}`}>
        <div className="card-body d-flex align-items-center gap-4">
          <img src={iconUrl} alt="weather" width="80" />
          <div>
            <h5 className="card-title">📍 {location}</h5>
            <p className="card-text mb-1">🌡️ 기온: {current.main.temp}°C</p>
            <p className="card-text">🌤️ 날씨: {currentDesc}</p>
          </div>
        </div>
      </div>

      {/* 미세먼지 카드 */}
      {air && (
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className={`card ${pm10Grade.border}`}>
              <div className="card-body">
                <h6 className="card-title">🌫 미세먼지 (PM10)</h6>
                <p>농도: {pm10} μg/m³</p>
                <span className={`badge bg-${pm10Grade.color}`}>{pm10Grade.label}</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card ${pm25Grade.border}`}>
              <div className="card-body">
                <h6 className="card-title">🌁 초미세먼지 (PM2.5)</h6>
                <p>농도: {pm25} μg/m³</p>
                <span className={`badge bg-${pm25Grade.color}`}>{pm25Grade.label}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 향후 예보 */}
      <h6 className="mb-3">🕘 향후 6시간 예보</h6>
      <div className="row g-3">
        {forecast.map((f, i) => {
          const desc = getKoreanWeatherDescription(f.weather[0].description);
          const cardColor = getCardColorClass(desc);
          return (
            <div key={i} className="col-md-6">
              <div className={`card ${cardColor}`}>
                <div className="card-body">
                  <p className="card-text">
                    {new Date(f.dt_txt).toLocaleString("ko-KR", {
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      hour12: true,
                    })}
                  </p>
                  <p className="fw-bold">{desc}</p>
                  <p>🌡️ {f.main.temp}°C</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherBox;
