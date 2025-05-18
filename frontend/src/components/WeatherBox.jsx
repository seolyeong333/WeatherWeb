// src/components/WeatherBox.jsx
// 현재 위치의 날씨, 미세먼지 정보, 6시간 예보를 보여주는 박스 UI
import { useEffect, useState } from "react";
import { getCurrentWeather, getAirPollution, getForecast } from "../api/weather";
import axios from "axios";
import { getKoreanWeatherDescription } from "../api/weatherMapping";
import { toKST } from "../hooks/time";

// 날씨 설명에 따라 카드 배경색 클래스 매핑
const weatherColorClassMap = {
  "맑음": "bg-info-subtle",
  "흐림": "bg-secondary-subtle",
  "구름 많음": "bg-light-subtle",
  "비": "bg-primary-subtle",
  "소나기": "bg-primary-subtle",
  "눈": "bg-light",
  "뇌우": "bg-dark-subtle",
  "안개": "bg-body-tertiary",
  "연무": "bg-body-tertiary",
};

// 메인 WeatherBox 컴포넌트
function WeatherBox({
  setIsRainy,   // 부모에게 비 상태 전달
  setIsSunny,   // ☀️
  setIsCloudy,  // ☁️
  setIsSnowy,   // ❄️
  setIsThunder, // ⛈️
  overrideWeather, // 테스트용 날씨 오버라이드
}) {
  const [location, setLocation] = useState("");      // 위치명 (카카오에서 변환)
  const [current, setCurrent] = useState(null);      // 현재 날씨 데이터
  const [forecast, setForecast] = useState([]);      // 6시간 예보 데이터
  const [air, setAir] = useState(null);              // 미세먼지(PM) 데이터

  // 날씨에 따른 카드 색상 클래스 반환
  const getCardColorClass = (desc) => weatherColorClassMap[desc] || "bg-light";

  // 날씨에 따른 애니메이션 클래스 결정
  const getAnimationClass = (desc) => {
    if (desc.includes("뇌우") || desc.includes("비") || desc.includes("소나기")) return "weather-rain";
    if (desc.includes("흐림") || desc.includes("구름")) return "weather-cloudy";
    if (desc.includes("맑음")) return "weather-sunny";
    if (desc.includes("눈")) return "weather-snow";
    return "";
  };

  // 컴포넌트 마운트 시 → 사용자 위치 기반 날씨, 공기, 위치명 불러오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // ✅ 현재 날씨
      getCurrentWeather(latitude, longitude).then((res) => {
        setCurrent(res.data);

        const rawDesc = res.data.weather[0].description;
        const desc = overrideWeather || getKoreanWeatherDescription(rawDesc);

        // 각 상태값 부모에 전달
        if (setIsRainy) setIsRainy(desc.includes("비") || desc.includes("소나기"));
        if (setIsSunny) setIsSunny(desc.includes("맑음"));
        if (setIsCloudy) setIsCloudy(desc.includes("흐림") || desc.includes("구름"));
        if (setIsSnowy) setIsSnowy(desc.includes("눈"));
        if (setIsThunder) setIsThunder(desc.includes("뇌우"));
      });

      // ✅ 6시간 이내 예보 (2개만 가져옴)
      getForecast(latitude, longitude).then((res) => {
        const now = new Date();
        const upcoming = res.data.list
          .filter((item) => toKST(item.dt_txt) > now)
          .slice(0, 2); // 다음 6시간 예보 기준
        setForecast(upcoming);
      });

      // ✅ 공기질 (미세먼지)
      getAirPollution(latitude, longitude).then((res) =>
        setAir(res.data.list[0].components)
      );

      // ✅ 카카오 API로 위치 이름 가져오기 (행정동 기준)
      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
          {
            headers: {
              Authorization: `KakaoAK e7c76873999ef901948568fdbf33233b`,
            },
          }
        );
        if (response.data.documents.length > 0) {
          const region = response.data.documents[0];
          setLocation(
            `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`
          );
        }
      } catch (error) {
        console.error("카카오 위치 변환 실패:", error);
      }
    });
  }, [overrideWeather]);

  // 아직 데이터 준비 안 되면 로딩 메시지
  if (!current || forecast.length === 0) return <div>Loading...</div>;

  // 날씨 아이콘 처리
  const iconCode = current.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // 설명 변환 및 스타일 계산
  const rawDesc = current.weather[0].description;
  const currentDesc = overrideWeather || getKoreanWeatherDescription(rawDesc);
  const currentCardClass = getCardColorClass(currentDesc);
  const currentAnimClass = getAnimationClass(currentDesc);

  // 미세먼지 상태값 계산
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

  // ✅ 렌더링 시작
  return (
    <div className="container">
      {/* 현재 날씨 카드 */}
      <div className={`card mb-4 position-relative ${currentCardClass} ${currentAnimClass}`}>
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
            <div className={`card border ${pm10Grade.border}`}>
              <div className="card-body">
                <h6 className="card-title">🌫 미세먼지 (PM10)</h6>
                <p>농도: {pm10} μg/m³</p>
                <span className={`badge bg-${pm10Grade.color}`}>{pm10Grade.label}</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card border ${pm25Grade.border}`}>
              <div className="card-body">
                <h6 className="card-title">🌁 초미세먼지 (PM2.5)</h6>
                <p>농도: {pm25} μg/m³</p>
                <span className={`badge bg-${pm25Grade.color}`}>{pm25Grade.label}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6시간 예보 */}
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
                    {toKST(f.dt_txt).toLocaleString("ko-KR", {
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
