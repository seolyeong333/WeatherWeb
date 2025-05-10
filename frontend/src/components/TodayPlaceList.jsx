import { useEffect, useState } from "react";
import "./TodayPlaceList.css";

function TodayPlaceList() {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({});

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

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
          setPlaces(data);
        } catch (err) {
          console.error("백엔드 장소 추천 요청 실패:", err);
        }
      },
      (err) => console.error("위치 접근 실패", err)
    );
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/bookmarks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("북마크 불러오기 실패");

        const bookmarks = await res.json();
        const map = {};
        bookmarks.forEach((b) => {
          map[b.placeId] = b.bookmarkId;
        });
        setBookmarkedMap(map);
      } catch (err) {
        console.error("북마크 목록 조회 실패", err);
      }
    };

    fetchBookmarks();
    fetchPlaceList("카페");
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchPlaceList(category);
  };

  const toggleBookmark = async (place) => {
    const token = localStorage.getItem("token");
    const placeKey = place.placeId || place.id;
    const bookmarkId = bookmarkedMap[placeKey];

    if (bookmarkId) {
      try {
        const res = await fetch(`http://localhost:8080/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const newMap = { ...bookmarkedMap };
          delete newMap[placeKey];
          setBookmarkedMap(newMap);
          console.log("❎ 북마크 삭제됨");
        } else {
          console.error("❌ 북마크 삭제 실패");
        }
      } catch (err) {
        console.error("❌ 삭제 에러:", err);
      }
    } else {
      try {
        const res = await fetch("http://localhost:8080/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: placeKey }),
        });

        if (res.ok) {
          const saved = await res.json();
          setBookmarkedMap((prev) => ({ ...prev, [placeKey]: saved.bookmarkId }));
          console.log("✅ 북마크 추가됨:", saved.bookmarkId);
        } else {
          console.error("❌ 북마크 실패");
        }
      } catch (err) {
        console.error("❌ 추가 에러:", err);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="search">
        <input type="text" placeholder="장소 이름 검색 (미구현)" />
        <button>🔍</button>
      </div>

      <div className="label-wrapper">
        {["음식점", "카페", "관광명소"].map((label) => (
          <button
            key={label}
            onClick={() => handleCategoryClick(label)}
            className={`label-button ${selectedCategory === label ? "selected" : ""}`}
          >
            <span style={{ marginRight: "5px" }}>
              {categoryCodeMap[label] === "FD6"
                ? "🍽️"
                : categoryCodeMap[label] === "CE7"
                ? "☕"
                : "🌳"}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {places.map((place, idx) => {
          const placeKey = place.placeId || place.id;
          return (
            <div key={placeKey} className="place-card">
              <div className="place-card-name">
                {place.placeName}
                <button
                  onClick={() => toggleBookmark(place)}
                  className="bookmark-button"
                  title="북마크"
                >
                  {bookmarkedMap[placeKey] ? "★" : "☆"}
                </button>
              </div>
              <div className="place-card-footer">
                <span>{place.phone || "📞 없음"}</span>
                <a href={place.placeUrl} target="_blank" rel="noreferrer">
                  🔗 보기
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodayPlaceList;
