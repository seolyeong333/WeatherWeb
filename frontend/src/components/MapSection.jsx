import { useEffect, useRef, useState } from "react";
import { toKST, getTodayDateNumberKST } from "../hooks/time";

const locations = [
  { name: "서울", lat: 37.5665, lon: 126.978 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "수원", lat: 37.2636, lon: 127.0286 },
  { name: "춘천", lat: 37.8813, lon: 127.7298 },
  { name: "청주", lat: 36.6424, lon: 127.489 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "전주", lat: 35.8242, lon: 127.148 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "목포", lat: 34.8118, lon: 126.3922 },
  { name: "제주", lat: 33.4996, lon: 126.5312 },
  { name: "여수", lat: 34.7604, lon: 127.6622 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "울산", lat: 35.5384, lon: 129.3114 },
  { name: "포항", lat: 36.019, lon: 129.3435 },
  { name: "안동", lat: 36.5684, lon: 128.7294 },
  { name: "대구", lat: 35.8722, lon: 128.6025 },
  { name: "강릉", lat: 37.7519, lon: 128.8761 },
  { name: "울릉/독도", lat: 37.4847, lon: 130.9056 },
];

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

const getColorByTemp = (temp) => {
  const t = parseFloat(temp);
  if (t <= 5) return "#4A90E2";
  if (t <= 10) return "#5BC0EB";
  if (t <= 15) return "#9DD9D2";
  if (t <= 20) return "#B5E48C";
  if (t <= 25) return "#FFE066";
  if (t <= 30) return "#FAB057";
  if (t <= 35) return "#F76C6C";
  return "#C94C4C";
};

function MapSection() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]); // ✅ 오버레이 추적용
  const [weatherData, setWeatherData] = useState([]);
  const [timeMode, setTimeMode] = useState("current");

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "4f673522ff69c4d615b1e593ce6fa16b";

      const results = await Promise.all(
        locations.map(async (loc) => {
          const url =
            timeMode === "current"
              ? `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`
              : `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`;

          const res = await fetch(url);
          const data = await res.json();

          let temp, description;
          const targetHour = timeMode === "morning" ? 6 : 15;
          const todayDate = getTodayDateNumberKST();

          if (timeMode === "current") {
            temp = data.main.temp.toFixed(1);
            description = data.weather[0].description;
          } else {
            const match = data.list.find((item) => {
              const dtKST = toKST(item.dt_txt);
              return dtKST.getHours() === targetHour && dtKST.getUTCDate() === todayDate;
            });
            const fallback = data.list.find((item) => {
              const dtKST = toKST(item.dt_txt);
              return dtKST.getUTCDate() === todayDate;
            });
            if (match) {
              temp = match.main.temp.toFixed(1);
              description = match.weather[0].description;
            } else if (fallback) {
              temp = fallback.main.temp.toFixed(1);
              description = fallback.weather[0].description;
            } else {
              temp = "-";
              description = "정보 없음";
            }
          }

          return {
            ...loc,
            temp,
            description,
            icon: getWeatherEmoji(description.toLowerCase()),
            color: getColorByTemp(temp),
          };
        })
      );

      setWeatherData(results);
    };

    fetchWeather();
  }, [timeMode]);

  useEffect(() => {
    if (!mapInstance.current && window.kakao && window.kakao.maps && mapContainer.current) {
      const bounds = new window.kakao.maps.LatLngBounds(
        new window.kakao.maps.LatLng(33.0, 124.5),
        new window.kakao.maps.LatLng(39.0, 132.0)
      );

      const map = new window.kakao.maps.Map(mapContainer.current, {
        center: new window.kakao.maps.LatLng(36.3, 127.8),
        level: 13,
      });

      map.setBounds(bounds);
      map.setMaxLevel(13);
      mapInstance.current = map;

      mapContainer.current.addEventListener(
        "touchmove",
        (e) => e.stopPropagation(),
        { passive: false }
      );
    }

    if (mapInstance.current && weatherData.length > 0) {
      // ✅ 기존 오버레이 제거
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];

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

        overlay.setMap(mapInstance.current);
        overlaysRef.current.push(overlay); // ✅ 저장
      });
    }
  }, [weatherData]);

  return (
    <div>
      <div className="mb-2 d-flex gap-2 justify-content-center">
        <button
          className={`btn btn-sm ${timeMode === "current" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setTimeMode("current")}
        >
          현재
        </button>
        <button
          className={`btn btn-sm ${timeMode === "morning" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTimeMode("morning")}
        >
          오늘오전
        </button>
        <button
          className={`btn btn-sm ${timeMode === "afternoon" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTimeMode("afternoon")}
        >
          오늘오후
        </button>
      </div>

      <div
        ref={mapContainer}
        className="w-100"
        style={{ height: "400px", borderRadius: "10px" }}
      ></div>
    </div>
  );
}

export default MapSection;
