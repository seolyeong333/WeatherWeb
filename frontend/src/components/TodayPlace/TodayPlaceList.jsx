import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json"; // 애니메이션 파일
import "./TodayPlaceList.css";

function TodayPlaceList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false); // 🔵 로딩 상태 추가
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({}); // { placeId: bookmarkId }

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  // 장소 리스트 가져오기
  const fetchPlaceList = async (category = "AT4", keyword = "") => {
    setLoading(true); // 🔵 로딩 시작
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
          let data = await res.json();

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
        } finally {
          setLoading(false); // 🟢 로딩 종료
        }
      },
      (err) => {
        console.error("위치 접근 실패:", err);
        setLoading(false);
      }
    );
  };

  // 북마크 목록 가져오기
  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("비로그인 상태");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/bookmarks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("북마크 가져오기 실패");

      const bookmarks = await res.json();
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

  const toggleBookmark = async (place) => {
    const token = localStorage.getItem("token");
    const placeKey = place.id;
    const bookmarkId = bookmarkedMap[placeKey];

    if (!token) {
      alert("로그인 후 이용 가능한 기능입니다.");
      return;
    } else if (bookmarkId) {
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

      {loading ? (
        <div className="loading-container">
          <Lottie animationData={loadingAnimation} loop={true} style={{ width: 200, height: 200 }} />
          <p>ONDA의 추천 장소 정보를 불러오는 중입니다...</p>
        </div>
      ) : places.length === 0 ? (
        <div className="no-results">검색 결과가 없습니다.</div>
      ) : (
        <div className="card-grid">
          {places.map((place) => {
            const placeKey = place.id;
            const isBookmarked = Boolean(bookmarkedMap[placeKey]);

            return (
              <div key={placeKey} className="place-card" onClick={() => navigate("/today-place/place-detail", { state: { place } })}>
                <div className="place-card-image">
                  <img
                    src={place.imageUrl || "/no-image.jpg"}
                    alt={place.placeName}
                    onError={(e) => { e.target.src = "/no-image.jpg"; }}
                  />
                </div>
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
