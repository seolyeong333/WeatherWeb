import { useEffect, useRef } from "react";
import Header from "../components/Header";

function TodayPlace() {
  const mapRef = useRef(null); // 지도 DOM 요소 참조

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

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
        console.error("위치 접근 실패", err);
      }
    );
  }, []);

  return (
    <div>
      <Header />

      <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>
        {/* 사이드 메뉴 */}
        <aside
          style={{
            width: "200px",
            backgroundColor: "#f5f5f5",
            padding: "1rem",
            boxShadow: "2px 0 4px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ marginBottom: "1rem" }}>🔍 메뉴</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <a href="/today-look" style={{ textDecoration: "none", color: "#333" }}>
                오늘의 코디
              </a>
            </li>
            <li>
              <a href="/today-place" style={{ textDecoration: "none", color: "#333" }}>
                지도 보기
              </a>
            </li>
          </ul>
        </aside>

        {/* 지도 영역 */}
        <main style={{ flex: 1, position: "relative" }}>
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "0 0 0 10px",
              zIndex: 1,
            }}
          />

          {/* 오른쪽 패널 */}
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "20px",
              width: "240px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              zIndex: 10,
            }}
          >
            {/* Section 2 - 날씨 */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h5 style={{ marginBottom: "0.5rem" }}>🌤️ 오늘의 날씨</h5>
              <p>서울시 강남구</p>
              <p>23.8°C / 맑음</p>
            </div>

            {/* Section 3 - 추천 장소 */}
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h5>📍 추천 플레이스</h5>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li>스타벅스 역삼</li>
                <li>카페 블루보틀</li>
                <li>도산공원</li>
              </ul>
              <button style={{ marginTop: "0.5rem", width: "100%" }}>Show more</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TodayPlace;
