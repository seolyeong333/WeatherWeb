// ✅ src/components/MapSection.jsx
import { useEffect, useRef } from "react";

const locations = [
  { name: "서울", lat: 37.5665, lon: 126.9780, temp: "21.0°" },
  { name: "인천", lat: 37.4563, lon: 126.7052, temp: "18.2°" },
  { name: "수원", lat: 37.2636, lon: 127.0286, temp: "20.0°" },
  { name: "춘천", lat: 37.8813, lon: 127.7298, temp: "20.8°" },
  { name: "청주", lat: 36.6424, lon: 127.4890, temp: "20.7°" },
  { name: "대전", lat: 36.3504, lon: 127.3845, temp: "20.5°" },
  { name: "전주", lat: 35.8242, lon: 127.1480, temp: "20.3°" },
  { name: "광주", lat: 35.1595, lon: 126.8526, temp: "21.7°" },
  { name: "목포", lat: 34.8118, lon: 126.3922, temp: "18.7°" },
  { name: "제주", lat: 33.4996, lon: 126.5312, temp: "18.3°" },
  { name: "여수", lat: 34.7604, lon: 127.6622, temp: "16.4°" },
  { name: "부산", lat: 35.1796, lon: 129.0756, temp: "16.4°" },
  { name: "울산", lat: 35.5384, lon: 129.3114, temp: "16.6°" },
  { name: "포항", lat: 36.0190, lon: 129.3435, temp: "18.7°" },
  { name: "안동", lat: 36.5684, lon: 128.7294, temp: "20.9°" },
  { name: "대구", lat: 35.8722, lon: 128.6025, temp: "21.0°" },
  { name: "강릉", lat: 37.7519, lon: 128.8761, temp: "19.3°" },
  { name: "울릉/독도", lat: 37.4847, lon: 130.9056, temp: "13.0°" },
];

function MapSection() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapContainer.current && !mapInstance.current) {
      const options = {
        center: new window.kakao.maps.LatLng(36.3, 127.8), // 전국 중심부
        level: 13,
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);
      mapInstance.current = map;

      locations.forEach(loc => {
        const position = new window.kakao.maps.LatLng(loc.lat, loc.lon);

        const content = `
          <div style="
            background: white;
            border-radius: 20px;
            border: 1px solid #ccc;
            padding: 6px 10px;
            font-size: 12px;
            text-align: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            white-space: nowrap;
          ">
            <strong>${loc.name}</strong><br/>
            🌞 ${loc.temp}
          </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: content,
          yAnchor: 1,
        });

        customOverlay.setMap(map);
      });
    }
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-100"
      style={{ height: "400px", borderRadius: "10px" }}
    ></div>
  );
}

export default MapSection;
