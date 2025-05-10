import { useEffect, useState } from "react";
import "./TodayPlaceList.css";

function TodayPlaceList() {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  // ✅ Kakao 백엔드 API 호출
  const fetchPlaceList = async (category = "CE7") => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const categoryCode = categoryCodeMap[category] || "CE7";

        try {
          const res = await fetch(
            `http://localhost:8080/api/kakao/places?lat=${lat}&lon=${lon}&category=${categoryCode}`
          );
          const data = await res.json();
          console.log("카카오 추천 장소:", data);
          setPlaces(data);
        } catch (err) {
          console.error("백엔드 장소 추천 요청 실패:", err);
        }
      },
      (err) => {
        console.error("위치 접근 실패", err);
      }
    );
  };

  useEffect(() => {
    fetchPlaceList("카페"); // 기본 카테고리: 카페
  }, []);

  const categories = [
    { label: "음식점", emoji: "🍽️" },
    { label: "카페", emoji: "☕" },
    { label: "관광명소", emoji: "🌳" },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchPlaceList(category);
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* 검색창 + 필터 */}
      <div className="search">
        <input type="text" placeholder="장소 이름 검색 (미구현)" />
        <button>🔍</button>
      </div>

      <div style={{ padding: "2rem" }}>
        {/* 카테고리 필터 */}
        <div className="label-wrapper">
          {categories.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => handleCategoryClick(label)}
              className={`label-button ${selectedCategory === label ? "selected" : ""}`}
            >
              <span style={{ marginRight: "5px" }}>{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* 카드 목록 */}
        <div className="card-grid">
          {places.map((place, idx) => (
            <div key={idx} className="place-card">
              <div className="place-card-name">{place.placeName}</div>
              <div className="place-card-footer">
                <span>{place.phone || "📞 없음"}</span>
                <a href={place.placeUrl} target="_blank" rel="noreferrer">🔗 보기</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TodayPlaceList;
