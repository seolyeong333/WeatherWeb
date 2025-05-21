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

const adjustedCoords = new Set();
function adjustPosition(lat, lon) {
  let key = `${lat.toFixed(3)}-${lon.toFixed(3)}`;
  let tries = 0;
  while (adjustedCoords.has(key) && tries < 10) {
    lat += (Math.random() - 0.5) * 0.06;
    lon += (Math.random() - 0.5) * 0.06;
    key = `${lat.toFixed(3)}-${lon.toFixed(3)}`;
    tries++;
  }
  adjustedCoords.add(key);
  return [lat, lon];
}

function applyManualOffset(loc) {
  const offsets = {
    "서울": [0.02, 0.01],
    "수원": [-0.02, -0.01],
    "인천": [0.01, -0.02],
    "대전": [0.01, 0.02],
    "청주": [-0.01, -0.02],
    "전주": [0.015, -0.015],
    "광주": [-0.015, 0.015],
    "대구": [0.01, -0.015],
    "울산": [-0.01, 0.01],
    "부산": [0.02, 0.01],
  };
  if (offsets[loc.name]) {
    const [latOffset, lonOffset] = offsets[loc.name];
    loc.lat += latOffset;
    loc.lon += lonOffset;
  }
  return loc;
}

function MapSection() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const overlaysRef = useRef([]);
  const hoverOverlayRef = useRef(null);
  const [weatherData, setWeatherData] = useState([]);
  const [timeMode, setTimeMode] = useState("current");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=8bcccc0b92f918feea4dfc630cf3537e&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setIsMapReady(true));
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "4f673522ff69c4d615b1e593ce6fa16b";
      adjustedCoords.clear();

      const results = await Promise.all(
        locations.map(async (loc) => {
          const url =
            timeMode === "current"
              ? `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`
              : `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`;

          const res = await fetch(url);
          const data = await res.json();

          let temp, description, wind, humidity;
          const targetHour = timeMode === "morning" ? 6 : 15;
          const todayDate = getTodayDateNumberKST();

          if (timeMode === "current") {
            temp = data.main.temp.toFixed(1);
            description = data.weather[0].description;
            wind = data.wind?.speed?.toFixed(1) || "-";
            humidity = data.main?.humidity || "-";
          } else {
            const match = data.list.find((item) => {
              const dtKST = toKST(item.dt_txt);
              return dtKST.getHours() === targetHour && dtKST.getUTCDate() === todayDate;
            });
            const fallback = data.list.find((item) => {
              const dtKST = toKST(item.dt_txt);
              return dtKST.getUTCDate() === todayDate;
            });
            const selected = match || fallback;
            if (selected) {
              temp = selected.main.temp.toFixed(1);
              description = selected.weather[0].description;
              wind = selected.wind?.speed?.toFixed(1) || "-";
              humidity = selected.main?.humidity || "-";
            } else {
              temp = "-";
              description = "정보 없음";
              wind = "-";
              humidity = "-";
            }
          }

          const [adjLat, adjLon] = adjustPosition(loc.lat, loc.lon);
          const offsetLoc = applyManualOffset({ ...loc, lat: adjLat, lon: adjLon });

          return {
            ...offsetLoc,
            temp,
            description,
            icon: getWeatherEmoji(description.toLowerCase()),
            color: getColorByTemp(temp),
            wind,
            humidity,
          };
        })
      );

      setWeatherData(results);
    };

    fetchWeather();
  }, [timeMode]);

  useEffect(() => {
    if (!isMapReady || !mapContainer.current) return;

    if (!mapInstance.current) {
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

      mapContainer.current.addEventListener("touchmove", (e) => e.stopPropagation(), {
        passive: false,
      });
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    weatherData.forEach((loc) => {
      const position = new window.kakao.maps.LatLng(loc.lat, loc.lon);

      const markerEl = document.createElement("div");
      markerEl.style.background = loc.color;
      markerEl.style.color = "black";
      markerEl.style.borderRadius = "20px";
      markerEl.style.border = "1px solid #ccc";
      markerEl.style.padding = "6px 10px";
      markerEl.style.fontSize = "12px";
      markerEl.style.textAlign = "center";
      markerEl.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      markerEl.style.whiteSpace = "nowrap";
      markerEl.innerHTML = `<strong>${loc.name}</strong><br/>${loc.icon} ${loc.temp}°`;

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content: markerEl,
        yAnchor: 1,
      });
      overlay.setMap(mapInstance.current);
      overlaysRef.current.push(overlay);

      const tooltipEl = document.createElement("div");
      tooltipEl.style.background = "white";
      tooltipEl.style.padding = "6px 10px";
      tooltipEl.style.borderRadius = "8px";
      tooltipEl.style.border = "1px solid #ccc";
      tooltipEl.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
      tooltipEl.style.fontSize = "12px";
      tooltipEl.style.whiteSpace = "nowrap";
      tooltipEl.innerHTML = `
        <strong>${loc.name}</strong><br/>
        ${loc.icon} ${loc.description} (${loc.temp}°C)<br/>
        💨 ${loc.wind} m/s&nbsp;&nbsp;&nbsp;💧${loc.humidity}%
      `;

      const tooltipOverlay = new window.kakao.maps.CustomOverlay({
        position,
        content: tooltipEl,
        yAnchor: 1.5,
      });

      markerEl.addEventListener("mouseenter", () => {
        if (hoverOverlayRef.current) hoverOverlayRef.current.setMap(null);
        tooltipOverlay.setMap(mapInstance.current);
        hoverOverlayRef.current = tooltipOverlay;
      });

      markerEl.addEventListener("mouseleave", () => {
        tooltipOverlay.setMap(null);
        hoverOverlayRef.current = null;
      });
    });
  }, [isMapReady, weatherData]);

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

      <div ref={mapContainer} className="w-100" style={{ height: "400px", borderRadius: "10px" }} />
    </div>
  );
}

export default MapSection;
