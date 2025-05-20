// TodayPlaceList.jsx
import { useEffect, useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json";
import "../../styles/TodayPlace/TodayPlaceList.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TodayPlaceList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({}); // 북마크 상태 저장
  const [searchParams] = useSearchParams();
  const keywordFromQuery = searchParams.get("keyword");

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  // 장소 목록 가져오기 (카테고리 또는 키워드 기반)
  const fetchPlaceList = async (category = "AT4", keyword = "") => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const categoryCode = categoryCodeMap[category] || "AT4";

        let url = `${API_BASE_URL}/api/kakao/places?lat=${lat}&lon=${lon}`;
        if (keyword) {
          url += `&keyword=${encodeURIComponent(keyword)}`;
          setSelectedCategory(null); // 키워드 검색 시 카테고리 선택 해제
        } else {
          url += `&category=${encodeURIComponent(categoryCode)}`;
        }

        try {
          const res = await fetch(url);
          const data = await res.json();

          // 각 장소에 대해 이미지만 병렬로 가져옴 (평점 제외)
          const updated = await Promise.all(
            data.map(async (place) => {
              try {
                const imageRes = await fetch(
                  `${API_BASE_URL}/api/google/image?name=${encodeURIComponent(place.placeName)}&lat=${place.y}&lon=${place.x}`
                );
                const imageUrl = await imageRes.text();
                return { ...place, imageUrl };
              } catch {
                return { ...place, imageUrl: null };
              }
            })
          );

          setPlaces(updated);
        } catch (err) {
          console.error("장소 요청 실패:", err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        console.error("위치 접근 실패");
        setLoading(false);
      }
    );
  };

  // 로그인된 유저의 북마크 목록 불러오기
  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // 컴포넌트 마운트 시 북마크 + 장소 목록 로딩
  useEffect(() => {
    fetchBookmarks();
    if (keywordFromQuery) {
      setKeyword(keywordFromQuery);
      fetchPlaceList("", keywordFromQuery);
    } else {
      fetchPlaceList("관광명소");
    }
  }, [keywordFromQuery]);

  // 카테고리 버튼 클릭 시 장소 검색
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchPlaceList(category);
  };

  // 북마크 추가/삭제 토글
  const toggleBookmark = async (place) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인 후 이용 가능합니다.");

    const placeKey = place.id;
    const bookmarkId = bookmarkedMap[placeKey];

    try {
      if (bookmarkId) {
        // 북마크 삭제
        const res = await fetch(`${API_BASE_URL}/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) await fetchBookmarks();
      } else {
        // 북마크 추가
        const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: placeKey, placeName: place.placeName }),
        });
        if (res.ok) await fetchBookmarks();
      }
    } catch (err) {
      console.error("북마크 처리 실패:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      {/* 검색 입력창 */}
      <div className="search">
        <input
          type="text"
          placeholder="장소 이름 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={() => fetchPlaceList(selectedCategory, keyword)}>🔍</button>
      </div>

      {/* 카테고리 버튼 */}
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

      {/* 로딩 중 화면 */}
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
              <div
                key={placeKey}
                className="place-card"
                onClick={() => navigate("/today-place/place-detail", { state: { place } })}
              >
                <div className="place-card-image">
                  <img
                    src={place.imageUrl || "/no-image.jpg"}
                    alt={place.placeName}
                    onError={(e) => {
                      e.target.src = "/no-image.jpg";
                    }}
                  />
                </div>
                <div className="place-card-name">
                  {place.placeName}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 부모 클릭 막기
                      toggleBookmark(place);
                    }}
                    className="bookmark-button"
                    title="북마크"
                  >
                    {isBookmarked ? (
                      <FaBookmark size={20} color="#ffcc00" />
                    ) : (
                      <FaRegBookmark size={20} color="#555" />
                    )}
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
