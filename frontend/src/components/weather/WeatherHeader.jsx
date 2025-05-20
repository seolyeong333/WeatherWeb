import React from "react";
import { getKoreanWeatherDescforWeather } from "../../utils/weatherUtil";

const getWeatherEmoji = (icon) => {
  if (!icon) return "🌈";
  if (icon.startsWith("01")) return "☀️";
  if (icon.startsWith("02")) return "🌤️";
  if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
  if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
  if (icon.startsWith("11")) return "⛈️";
  if (icon.startsWith("13")) return "❄️";
  if (icon.startsWith("50")) return "🌫️";
  return "🌈";
};

const getLevel = (value, type) => {
  if (type === "pm10") {
    if (value <= 30) return { label: "좋음", color: "#4CAF50" };
    if (value <= 80) return { label: "보통", color: "#FFD600" };
    if (value <= 150) return { label: "나쁨", color: "#FF9800" };
    return { label: "매우나쁨", color: "#F44336" };
  } else { // pm2.5
    if (value <= 15) return { label: "좋음", color: "#4CAF50" };
    if (value <= 35) return { label: "보통", color: "#FFD600" };
    if (value <= 75) return { label: "나쁨", color: "#FF9800" };
    return { label: "매우나쁨", color: "#F44336" };
  }
};

function WeatherHeader({ currentWeather, hourlyPop, currentPollution, regionName }) {
  // if (currentPollution) { // 디버깅용 로그
  //   console.log("WeatherHeader received currentPollution:", currentPollution);
  // }

  if (!currentWeather) return null;

  const temp = Math.round(currentWeather.main.temp);
  const humidity = currentWeather.main.humidity;
  const pop = Math.round((hourlyPop || 0) * 100);

  const rawDesc = currentWeather.weather[0].description;
  const icon = currentWeather.weather[0].icon;
  const emoji = getWeatherEmoji(icon);
  const description = getKoreanWeatherDescforWeather(rawDesc);

  // ✅ 수정된 부분: currentPollution 객체에서 pm10과 pm25 직접 접근
  const pm10 = currentPollution?.pm10;
  const pm25 = currentPollution?.pm25; // 키 이름이 pm2_5에서 pm25로 변경됨 (콘솔 로그 기반)

  const pm10Level = pm10 !== undefined ? getLevel(pm10, "pm10") : null;
  const pm25Level = pm25 !== undefined ? getLevel(pm25, "pm25") : null;

  return (
    <div className="header-section">
      <div className="header-overlay">
        <div>
          <h1 className="header-title">맑음이든 흐림이든, 오늘의 하늘은 당신 편이에요</h1>
          <br />
          {regionName && (
            <p className="header-subtext">현재 위치: {regionName}</p>
          )}
        </div>

        <div className="header-summary-line">
          {emoji} {description}, {temp}°C / 습도 {humidity}% / 강수 확률 {pop}%
        </div>

        {currentPollution && pm10Level && pm25Level && (
          <div className="dust-text-line" style={{ marginTop: "0.5rem", fontSize: "14px" }}>
            미세먼지 (PM10): <span style={{ color: pm10Level.color }}>{pm10Level.label} ({pm10 !== undefined ? pm10.toFixed(2) : '-'}µg/m³)</span> /
            초미세먼지 (PM2.5): <span style={{ color: pm25Level.color }}>{pm25Level.label} ({pm25 !== undefined ? pm25.toFixed(2) : '-'}µg/m³)</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherHeader;