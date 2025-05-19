// src/pages/TodayPlaceList.jsx
import { useEffect, useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json"; // 애니메이션 파일
import "../../styles/TodayPlace/TodayPlaceList.css";

function TodayPlaceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({}); // { placeId: bookmarkId }
  const [searchParams] = useSearchParams();
  const keywordFromQuery = searchParams.get("keyword");

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  // 장소 리스트 가져오기
  const fetchPlaceList = async (category = "AT4", keyword = "") => {
    console.log("📡 검색 요청:", { category, keyword });
  
    setLoading(true);
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
  
        console.log("🔗 최종 호출 URL:", url);
  
        try {
          const res = await fetch(url);
          let data = await res.json();
          console.log("📦 응답 데이터 수:", data.length);

          const updated = await Promise.all(
            data.map(async (place) => {
              try {
                const [imageRes, ratingRes] = await Promise.all([
                  fetch(`http://localhost:8080/api/google/image?name=${encodeURIComponent(place.placeName)}&lat=${place.y}&lon=${place.x}`),
                  fetch(`http://localhost:8080/api/google/rating?name=${encodeURIComponent(place.placeName)}&lat=${place.y}&lon=${place.x}`)
                ]);
          
                const imageUrl = await imageRes.text();
                const ratingText = await ratingRes.text();
                const rating = parseFloat(ratingText); // 평점 숫자 변환
          
                return { ...place, imageUrl, rating: isNaN(rating) ? null : rating };
              } catch (e) {
                console.warn("이미지/평점 로딩 실패:", place.placeName);
                return { ...place, imageUrl: null, rating: null };
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
      (err) => {
        console.error("위치 접근 실패:", err);
        setLoading(false);
      }
    );
  };

  // 북마크 목록 가져오기
  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/bookmarks", {
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

  useEffect(() => {
    fetchBookmarks();
    console.log("✅ URL 쿼리 keyword:", keywordFromQuery); // 이게 null이면 URL이 잘못된 것
    if (keywordFromQuery) {
      setKeyword(keywordFromQuery);
      fetchPlaceList("", keywordFromQuery);
    } else {
      fetchPlaceList("관광명소");
    }
  }, [keywordFromQuery]);
  

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchPlaceList(category);
  };

  const toggleBookmark = async (place) => {
    const token = localStorage.getItem("token");
    const placeKey = place.id;
    const bookmarkId = bookmarkedMap[placeKey];
  
    if (!token) return alert("로그인 후 이용 가능합니다.");
  
    try {
      if (bookmarkId) {
        // ✅ 북마크 삭제
        const res = await fetch(`http://localhost:8080/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          await fetchBookmarks(); // ⬅️ 삭제 후에도 최신 DB 상태 반영
        }
      } else {
        // ✅ 북마크 추가
        const res = await fetch("http://localhost:8080/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: placeKey, placeName: place.placeName }),
        });
        if (res.ok) {
          await fetchBookmarks(); // ⬅️ 추가 후 최신 상태 유지
        }
      }
    } catch (err) {
      console.error("북마크 처리 실패:", err);
    }
  };
  

  return (
    <div style={{ padding: "2rem", color: "black" }}>
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
                      e.stopPropagation();
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
                  {place.rating !== undefined && place.rating !== null && (
                    <span style={{ marginLeft: "8px" }}>⭐ {place.rating}</span>
                  )}
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