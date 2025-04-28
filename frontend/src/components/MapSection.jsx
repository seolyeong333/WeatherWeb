import { useEffect, useRef } from "react";

function MapSection() {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.5), // 한반도 중앙쯤
        level: 12, // 전국을 한눈에 보이게 zoom out
      };

      const map = new window.kakao.maps.Map(mapContainer.current, options);

      // 나중에 주요 도시 마커 찍을 수 있음
    }
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "10px",
      }}
    ></div>
  );
}

export default MapSection;
