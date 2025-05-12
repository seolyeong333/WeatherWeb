import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TodayPlaceList.css";

function TodayPlaceList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({}); // { placeId: bookmarkId }

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  // 장소 리스트 가져오기
  const fetchPlaceList = async (category = "AT4", keyword = "") => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const categoryCode = categoryCodeMap[category] || "AT4";
  
        let url = `http://localhost:8080/api/kakao/places?lat=${lat}&lon=${lon}`;
        if (keyword) {
          url += `&keyword=${encodeURIComponent(keyword)}`;
          setSelectedCategory(null);
        } else {
          url += `&category=${encodeURIComponent(categoryCode)}`;
        }
  
        try {
          const res = await fetch(url);
          let data = await res.json(); // [{ id, placeName, ... }] ← imageUrl 아직 없음
  
          // 🔁 각 장소마다 이미지 요청 추가
          const updated = await Promise.all(
            data.map(async (place) => {
              try {
                const imageRes = await fetch(
                  `http://localhost:8080/api/google/image?name=${encodeURIComponent(place.placeName)}&lat=${place.y}&lon=${place.x}`
                );
                const imageUrl = await imageRes.text();
                return { ...place, imageUrl };
              } catch (e) {
                console.warn("이미지 로딩 실패:", place.placeName);
                return { ...place, imageUrl: null };
              }
            })
          );
  
          setPlaces(updated);
        } catch (err) {
          console.error("장소 요청 실패:", err);
        }
      },
      (err) => console.error("위치 접근 실패:", err)
    );
  };
  
  

  // 북마크 목록 가져오기
  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("비로그인 상태");
      return; // 토큰 없으면 아예 실행 안 함
    }
    try {
      const res = await fetch("http://localhost:8080/api/bookmarks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 로그인 할때만 가능해서 토큰 넘겨버림
        },
      });

      if (!res.ok) throw new Error("북마크 가져오기 실패");

      const bookmarks = await res.json();   // 내 북마크 목록 json으로 받아와서 체크함
      const map = {};
      bookmarks.forEach((b) => {
        map[b.placeId] = b.bookmarkId;
      });
      setBookmarkedMap(map);
    } catch (err) {
      console.error("북마크 목록 실패:", err);
    }
  };

  useEffect(() => {
    fetchBookmarks();
    fetchPlaceList("관광명소");
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchPlaceList(category);
  };

  // 북마크 토글
  const toggleBookmark = async (place) => {
    const token = localStorage.getItem("token");
    const placeKey = place.id; 
    const bookmarkId = bookmarkedMap[placeKey];


    if (!token) {              // 로그인 안하면 북마크 못하게 막기. 
      alert("로그인 후 이용 가능한 기능입니다.");
      return;
    } else if (bookmarkId) {   // 북마크 아이디가 내가 가져온 리스트에 존재하면 북마크 삭제 
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
    } else {    // 북마크 아이디가 내가 가져온 리스트에 존재하지 않으면 북마크 추가 
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
          const saved = await res.json(); // { bookmarkId: ... }
          setBookmarkedMap((prev) => ({ ...prev, [placeKey]: saved.bookmarkId }));
          console.log("✅ 북마크 추가됨:", saved.bookmarkId);
          await fetchBookmarks(); 
        } else {
          console.error("❌ 북마크 추가 실패");
        }
      } catch (err) {
        console.error("❌ 추가 에러:", err);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="search">
        <input
          type="text"
          placeholder="장소 이름 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={() => fetchPlaceList(selectedCategory, keyword)}>🔍</button>
      </div>
  
      <div className="label-wrapper">
        {["음식점", "카페", "관광명소"].map((label) => (
          <button
            key={label}
            onClick={() => handleCategoryClick(label)}
            className={`label-button ${selectedCategory === label ? "selected" : ""}`}
          >
            <span style={{ marginRight: "5px" }}>
              {categoryCodeMap[label] === "FD6" ? "🍽️" : categoryCodeMap[label] === "CE7" ? "☕" : "🌳"}
            </span>
            {label}
          </button>
        ))}
      </div>
  
      {places.length === 0 ? (
        <div className="no-results">검색 결과가 없습니다.</div>
      ) : (
        <div className="card-grid">
          {places.map((place) => {
            const placeKey = place.id;
            const isBookmarked = Boolean(bookmarkedMap[placeKey]);
  
            return (
              <div key={placeKey} className="place-card" onClick={() => navigate("/place-detail", { state: { place } })}>
                {/* 📷 이미지 영역 */}
                <div className="place-card-image">
                  <img
                    src={place.imageUrl || "/no-image.jpg"} // 이미지 없으면 대체 이미지
                    alt={place.placeName}
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                </div>

                {/* 📛 이름 + 북마크 */}
                <div className="place-card-name">
                  {place.placeName}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(place);
                    }}
                    className="bookmark-button"
                    title="북마크"
                  >
                    {isBookmarked ? "★" : "☆"}
                  </button>
                </div>

                {/* ☎ 전화번호 */}
                <div className="place-card-footer">
                  <span>{place.phone || "📞 없음"}</span>
                </div>
              </div>

            );
          })}
        </div>
      )}
    </div>
  );
  
}

export default TodayPlaceList;
