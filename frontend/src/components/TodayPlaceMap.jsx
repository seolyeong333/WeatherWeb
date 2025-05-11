import { useEffect, useRef, useState } from "react";
import "./TodayPlaceMap.css";

function TodayPlaceMap() {
    const mapRef = useRef(null); // 지도 DOM 요소 참조
    const hasRun = useRef(false); // useEffect 실행 여부 제어
    const [places, setPlaces] = useState([]); // 추천 장소 목록
  
    //infowindow - 코드 수정 필요
    const [showMark, setShowMark] = useState("");
    const showMarkRef = useRef("");
    const currentInfoRef = useRef(null); 
    useEffect(() => {
      showMarkRef.current = showMark;
    }, [showMark]);
  
    const loadMapAndPlaces = async (category = null) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const loc = new window.kakao.maps.LatLng(lat, lon);
  
          // 지도 생성
          const map = new window.kakao.maps.Map(mapRef.current, {
            center: loc,
            level: 5,
          });
  
          // 내 위치 마커 (⭐)
          new window.kakao.maps.Marker({
            map,
            position: loc,
            title: "내 위치",
            image: new window.kakao.maps.MarkerImage(
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              new window.kakao.maps.Size(24, 35)
            ),
          });
  
          // 추천 장소 요청 (OpenAI)
          try {
            const body = {
              location: `${lat},${lon}`,
            };
            if (category) body.category = category;
  
            const res = await fetch("http://localhost:8080/api/ai/ask", {
              method: "POST",
              headers: { "Content-Type": "application/json",
               },
              body: JSON.stringify(body),
            });
  
            const answer = await res.text();
            const result = answer.replace(/```json|```/g, "").trim();
            const json = JSON.parse(result);
            console.log("받아온 추천 장소 목록:", json);
            setPlaces(json);
  
            // 추천 장소 마커 표시
            json.forEach((place) => {
              const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
              const marker = new window.kakao.maps.Marker({
                map,
                position,
                title: place.name,
              });
  
                // InfoWindow 생성
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:8px;font-size:13px;">📍 ${place.name}</div>`,
              });
  
              // 마커 클릭 시 InfoWindow 열기
              window.kakao.maps.event.addListener(marker, "click", () => {
                if (currentInfoRef.current) {
                  currentInfoRef.current.close();
                  // 동일한 마커를 다시 누른 경우: 닫고 끝내기
                  if (showMarkRef.current === place.name) {
                    setShowMark("");
                    currentInfoRef.current = null;
                    return;
                  }
                } else {
                  infowindow.open(map, marker);
                  setShowMark(place.name); // 새로 열기
                }
              });
            });
          } catch (err) {
            console.error("OpenAI 요청 실패:", err);
          }
        },
        (err) => {
          console.error("위치 접근 실패", err);
        }
      );
    };
  
    useEffect(() => {
      if (hasRun.current) return;
      hasRun.current = true;
      loadMapAndPlaces(); // 처음엔 전체 추천
    }, []);
  
    // 카테고리 필터 클릭
    const handleCategoryClick = (category) => {
      loadMapAndPlaces(category);
    };

    return (
        <div>
            {/* 지도 영역 */}
            <main style={{ flex: 1, position: "relative" }}>
              {/* 지도 */}
              <div
                ref={mapRef}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "0 0 0 10px",
                  zIndex: 1,
                }}
              />
    
             {/* 좌측 상단 카테고리 필터 */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  zIndex: 10,
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                {[
                  { label: "음식점", emoji: "🍽️", color: "#F26B3A" },
                  { label: "카페", emoji: "☕", color: "#C47130" },
                  { label: "술집", emoji: "🍺", color: "#916BBF" },
                  { label: "공원", emoji: "🌳", color: "#3AA655" },
                ].map(({ label, emoji, color }) => (
                  <button
                    key={label}
                    onClick={() => handleCategoryClick(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "0.4rem 0.8rem",
                      border: "none",
                      backgroundColor: "#fff",
                      borderRadius: "30px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color, fontSize: "1.2rem" }}>{emoji}</span>
                    <span style={{ color: "#333", fontSize: "0.95rem" }}>{label}</span>
                  </button>
                ))}
              </div>
    
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
                {/* 날씨 정보 */}
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
    
                {/* 추천 장소 */}
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
                    {places.map((place, idx) => (
                      <li key={idx}>{place.name}</li>
                    ))}
                  </ul>
                  <button style={{ marginTop: "0.5rem", width: "100%" }}>Show more</button>
                </div>
              </div>
            </main>
        </div>
      );
    }
    
    export default TodayPlaceMap;