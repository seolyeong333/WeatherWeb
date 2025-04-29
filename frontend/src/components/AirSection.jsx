import { useEffect, useState } from "react";
import { getAirPollution } from "../api/weather"; // 경로는 네 프로젝트 기준 맞춰줘!

function getAirQualityGrade(pm10) {
  if (pm10 <= 30) return { grade: "좋음", color: "blue" };
  if (pm10 <= 80) return { grade: "보통", color: "green" };
  if (pm10 <= 150) return { grade: "나쁨", color: "orange" };
  return { grade: "매우 나쁨", color: "red" };
}

function getFineDustGrade(pm25) {
  if (pm25 <= 15) return { grade: "좋음", color: "blue" };
  if (pm25 <= 35) return { grade: "보통", color: "green" };
  if (pm25 <= 75) return { grade: "나쁨", color: "orange" };
  return { grade: "매우 나쁨", color: "red" };
}

function AirSection() {
  const [airData, setAirData] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const res = await getAirPollution(latitude, longitude);
      setAirData(res.data);
    });
  }, []);

  if (!airData) return <div>Loading...</div>;

  const pm10 = airData.list[0].components.pm10;
  const pm25 = airData.list[0].components.pm2_5;

  const pm10Grade = getAirQualityGrade(pm10);
  const pm25Grade = getFineDustGrade(pm25);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌫️ 미세먼지 정보</h2>

      {/* 💬 미세먼지(PM10) / 초미세먼지(PM2.5) 나란히 */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        {/* 왼쪽: 미세먼지 */}
        <div style={{ textAlign: "center" }}>
          <h3>PM10 (미세먼지)</h3>
          <p>농도: {pm10} μg/m³</p>
          <p style={{ color: pm10Grade.color }}>등급: {pm10Grade.grade}</p>
        </div>

        {/* 오른쪽: 초미세먼지 */}
        <div style={{ textAlign: "center" }}>
          <h3>PM2.5 (초미세먼지)</h3>
          <p>농도: {pm25} μg/m³</p>
          <p style={{ color: pm25Grade.color }}>등급: {pm25Grade.grade}</p>
        </div>
      </div>
    </div>
  );
}

export default AirSection;
