import { useEffect, useRef } from "react";

function TodayPlace() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    // 위치 요청
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(lat, lon),
          level: 5,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 현재 위치 마커
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(lat, lon),
        });
      },
      (err) => {
        console.error("위치 가져오기 실패", err);
      }
    );
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>오늘의 장소 추천</h2>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", borderRadius: "10px", margin: "20px auto" }}
      />
    </div>
  );
}

export default TodayPlace;
