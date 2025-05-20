import React from "react";
import { getKoreanWeatherDescforWeather } from "../../utils/weatherUtil"; // 경로 수정

// 오늘의 추천 팁 함수
const getTip = (desc, max) => {
  if (desc.includes("비")) return "☔ 우산을 챙기세요!";
  if (desc.includes("맑음") && max > 25) return "🌞 자외선 차단제를 준비하세요!";
  if (max < 10) return "🧥 외투를 준비하세요!";
  return "🌿 산책하기 좋은 날씨입니다.";
};

function WeatherDetailSummary({ dailySummary }) {
  if (!dailySummary) return null;

  const rawDesc = dailySummary.weather.description;
  const desc = getKoreanWeatherDescforWeather(rawDesc);
  const max = Math.round(dailySummary.temp_max);
  const min = Math.round(dailySummary.temp_min);

  return (
    <div className="detail-section">
      <h2 className="detail-title">오늘의 날씨 요약</h2>
      <div className="summary-box">
        <p>오늘은 <strong>{desc}</strong>이며, 기온은 <strong>{min}°C ~ {max}°C</strong>입니다.</p>
      </div>
      <div className="recommendation-box">
        <h3>오늘의 추천</h3>
        <p>{getTip(desc, max)}</p>
      </div>
    </div>
  );
}

export default WeatherDetailSummary;