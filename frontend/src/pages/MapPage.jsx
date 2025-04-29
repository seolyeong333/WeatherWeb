// ✅ src/pages/MapPage.jsx
// 역할: 카카오맵 API를 이용해 지도 출력 + 지도 클릭해서 현재 위치 변경
// 주의: Kakao 지도 SDK가 public/index.html에 추가되어 있어야 함

import { useEffect, useRef, useState } from "react"; // React Hook import

function MapPage() {
  const mapContainer = useRef(null);   // 🌟 지도 div 참조
  const [map, setMap] = useState(null); // 🌟 지도 객체 저장
  const [marker, setMarker] = useState(null); // 🌟 마커 객체 저장

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      // ✅ 초기에 현재 위치 가져오기
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords; // 내 위치 (위도, 경도)

          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };

          const createdMap = new window.kakao.maps.Map(mapContainer.current, options);
          setMap(createdMap);

          const createdMarker = new window.kakao.maps.Marker({
            position: options.center,
            map: createdMap, // 생성 시 지도에 바로 표시
          });
          setMarker(createdMarker);

          // ✅ 화면 크기 강제 리사이즈 (필수)
          window.kakao.maps.event.trigger(createdMap, "resize");

          // ✅ 지도 클릭 이벤트 추가
          window.kakao.maps.event.addListener(createdMap, "click", function (mouseEvent) {
            const clickedLatLng = mouseEvent.latLng; // 클릭한 좌표 얻기

            // 기존 마커가 있으면 이동
            if (marker) {
              marker.setPosition(clickedLatLng);
            } else {
              // 처음이라면 새로 만들기
              const newMarker = new window.kakao.maps.Marker({
                position: clickedLatLng,
                map: createdMap,
              });
              setMarker(newMarker);
            }

            // 클릭한 좌표를 서버나 상태에 저장하거나, 주변 장소 조회에 사용할 수 있음
            console.log("선택된 위치:", clickedLatLng.getLat(), clickedLatLng.getLng());
          });
        },
        (error) => {
          alert("위치 정보 가져오기 실패: " + error.message);
        }
      );
    }
  }, []);

  return (
    <div style={{ width: "400%", height: "calc(70vh - 100px)", padding: "100px" }}>
      {/* mapContainer가 이 div를 참조해서 지도 생성 */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export default MapPage;
