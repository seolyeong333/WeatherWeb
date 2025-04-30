import { useEffect, useRef, useState } from "react";

// 주요 도시
const locations = [
  { name: "서울", lat: 37.5665, lon: 126.9780 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "수원", lat: 37.2636, lon: 127.0286 },
  { name: "춘천", lat: 37.8813, lon: 127.7298 },
  { name: "청주", lat: 36.6424, lon: 127.4890 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "전주", lat: 35.8242, lon: 127.1480 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "목포", lat: 34.8118, lon: 126.3922 },
  { name: "제주", lat: 33.4996, lon: 126.5312 },
  { name: "여수", lat: 34.7604, lon: 127.6622 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "울산", lat: 35.5384, lon: 129.3114 },
  { name: "포항", lat: 36.0190, lon: 129.3435 },
  { name: "안동", lat: 36.5684, lon: 128.7294 },
  { name: "대구", lat: 35.8722, lon: 128.6025 },
  { name: "강릉", lat: 37.7519, lon: 128.8761 },
  { name: "울릉/독도", lat: 37.4847, lon: 130.9056 },
];

// 날씨 ➝ 이모지
const getWeatherEmoji = (desc) => {
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("thunder")) return "🌩️";
  if (desc.includes("drizzle")) return "🌦️";
  if (desc.includes("haze") || desc.includes("smoke")) return "🌫️";
  return "🌡️";
};

// 온도 ➝ 색상
const getColorByTemp = (temp) => {
  const t = parseFloat(temp);
  if (t <= 5) return "#4A90E2";      // 파랑
  if (t <= 10) return "#5BC0EB";     // 하늘
  if (t <= 15) return "#9DD9D2";     // 민트
  if (t <= 20) return "#B5E48C";     // 연녹
  if (t <= 25) return "#FFE066";     // 노랑
  if (t <= 30) return "#FAB057";     // 주황
  if (t <= 35) return "#F76C6C";     // 빨강
  return "#C94C4C";                  // 진한 빨강
};

// 시간대 매핑
const timeMap = {
  morning: "06:00:00",
  afternoon: "15:00:00",
};

function MapSection() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [weatherData, setWeatherData] = useState([]);
  const [timeSlot, setTimeSlot] = useState("current"); // current | morning | afternoon

  // 💡 날씨 요청
  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "4f673522ff69c4d615b1e593ce6fa16b"; // 🔑 너의 OpenWeather API 키

      const results = await Promise.all(
        locations.map(async (loc) => {
          if (timeSlot === "current") {
            // 실시간 날씨
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();
            return {
              ...loc,
              temp: data.main.temp.toFixed(1),
              description: data.weather[0].description,
              icon: getWeatherEmoji(data.weather[0].description.toLowerCase()),
              color: getColorByTemp(data.main.temp),
            };
          } else {
            // 예보 데이터
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`;
            const res = await fetch(url);
            const data = await res.json();
            const target = timeMap[timeSlot];
            const forecast = data.list.find((f) => f.dt_txt.includes(target)) || data.list[0];
            return {
              ...loc,
              temp: forecast.main.temp.toFixed(1),
              description: forecast.weather[0].description,
              icon: getWeatherEmoji(forecast.weather[0].description.toLowerCase()),
              color: getColorByTemp(forecast.main.temp),
            };
          }
        })
      );

      setWeatherData(results);
    };

    fetchWeather();
  }, [timeSlot]);

  // 💡 지도 생성 및 오버레이 표시
  useEffect(() => {
    if (
      window.kakao &&
      window.kakao.maps &&
      mapContainer.current &&
      !mapInstance.current &&
      weatherData.length > 0
    ) {
      const options = {
        center: new window.kakao.maps.LatLng(36.3, 127.8),
        level: 13,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      weatherData.forEach((loc) => {
        const position = new window.kakao.maps.LatLng(loc.lat, loc.lon);

        const content = `
          <div style="
            background: ${loc.color};
            color: black;
            border-radius: 20px;
            border: 1px solid #ccc;
            padding: 6px 10px;
            font-size: 12px;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            white-space: nowrap;">
            <strong>${loc.name}</strong><br/>
            ${loc.icon} ${loc.temp}°
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1,
        });

        overlay.setMap(map);
      });
    }
  }, [weatherData]);

  return (
    <div>
      {/* 버튼 영역 */}
      <div className="d-flex gap-2 mb-2 justify-content-center">
        <button className={`btn btn-sm ${timeSlot === "current" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setTimeSlot("current")}>현재</button>
        <button className={`btn btn-sm ${timeSlot === "morning" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setTimeSlot("morning")}>오늘 오전</button>
        <button className={`btn btn-sm ${timeSlot === "afternoon" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setTimeSlot("afternoon")}>오늘 오후</button>
      </div>

      {/* 지도 영역 */}
      <div
        ref={mapContainer}
        className="w-100"
        style={{ height: "400px", borderRadius: "10px" }}
      ></div>
    </div>
  );
}

export default MapSection;
