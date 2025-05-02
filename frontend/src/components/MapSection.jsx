import { useEffect, useRef, useState } from "react";
import { toKST, getTodayDateNumberKST } from "../hooks/time"; // 한국시간(KST) 관련 유틸 함수

// 전국 주요 도시의 위도/경도 정보
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

// 날씨 설명 텍스트를 이모지로 변환
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

// 온도에 따라 배경색 결정 (시각적으로 구분 가능)
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
  const mapContainer = useRef(null);        // Kakao map DOM 컨테이너 참조
  const mapInstance = useRef(null);         // Kakao map 인스턴스 보관
  const [weatherData, setWeatherData] = useState([]); // 날씨 데이터 저장
  const [timeMode, setTimeMode] = useState("current"); // 시간 모드: 현재/오전/오후

  // ✅ 날씨 데이터 불러오기 (도시 전체 요청)
  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "4f673522ff69c4d615b1e593ce6fa16b";

      // 모든 지역 날씨 병렬 요청 (Promise.all)
      const results = await Promise.all(
        locations.map(async (loc) => {
          // 시간 모드에 따라 현재 or 예보 API 분기
          const url =
            timeMode === "current"
              ? `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`
              : `https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}&units=metric`;

          const res = await fetch(url);
          const data = await res.json();

          let temp, description;

          if (timeMode === "current") {
            // 현재 날씨는 바로 꺼내면 됨
            temp = data.main.temp.toFixed(1);
            description = data.weather[0].description;
          } else {
            // 오전(6시), 오후(15시) 기준 데이터 찾기
            const targetHour = timeMode === "morning" ? 6 : 15;
            const todayDate = getTodayDateNumberKST();

            const match = data.list.find((item) => {
              const dtKST = toKST(item.dt_txt);
              return dtKST.getHours() === targetHour && dtKST.getUTCDate() === todayDate;
            });

            if (match) {
              temp = match.main.temp.toFixed(1);
              description = match.weather[0].description;
            } else {
              // 일치하는 시간이 없으면 데이터 없음 처리
              temp = "-";
              description = "정보 없음";
            }
          }

          // 최종 변환된 도시 날씨 정보 반환
          return {
            ...loc,
            temp,
            description,
            icon: getWeatherEmoji(description.toLowerCase()),
            color: getColorByTemp(temp),
          };
        })
      );

      // 전체 결과 반영
      setWeatherData(results);
    };

    fetchWeather();
  }, [timeMode]); // 시간 모드가 바뀔 때마다 다시 실행됨

  // ✅ 지도 렌더링 및 마커 표시
  useEffect(() => {
    // Kakao map이 준비되고 날씨 데이터가 존재할 때
    if (
      window.kakao &&
      window.kakao.maps &&
      mapContainer.current &&
      weatherData.length > 0
    ) {
      // 지도 생성
      const map = new window.kakao.maps.Map(mapContainer.current, {
        center: new window.kakao.maps.LatLng(36.3, 127.8),
        level: 13,
      });
      mapInstance.current = map;

      // 각 도시마다 커스텀 오버레이(날씨 마커) 생성
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
      {/* 시간 모드 토글 버튼 */}
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

      {/* Kakao 지도가 표시될 영역 */}
      <div
        ref={mapContainer}
        className="w-100"
        style={{ height: "400px", borderRadius: "10px" }}
      ></div>
    </div>
  );
}

export default MapSection;
