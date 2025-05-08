import { useEffect, useRef } from "react";

function TodayPlace() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        console.log("정확히 잡힌 위도/경도", lat, lon);
        const loc = new window.kakao.maps.LatLng(lat, lon);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: loc,
          level: 5,
        });

        new window.kakao.maps.Marker({
          map,
          position: loc,
        });
      },
      (err) => {
        console.error("정확한 위치를 불러오지 못했습니다", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
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
