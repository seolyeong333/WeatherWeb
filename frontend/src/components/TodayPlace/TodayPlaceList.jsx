import { useEffect, useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import axios from "axios";
import loadingAnimation from "../../assets/loading.json";
import { getCurrentWeather } from "../../api/weather";
import { getKoreanWeatherDescription } from "../../utils/weatherUtil";
import { Modal, Button } from "react-bootstrap"; // ✅ Bootstrap 모달 추가
import "../../styles/TodayPlace/TodayPlaceList.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TodayPlaceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fitList, setFitList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookmarkedMap, setBookmarkedMap] = useState({});
  const [searchParams] = useSearchParams();
  const keywordFromQuery = searchParams.get("keyword");

  // ✅ 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const categoryCodeMap = {
    "음식점": "FD6",
    "카페": "CE7",
    "관광명소": "AT4",
  };

  const fetchWeatherFitList = (lat, lon) => {
    getCurrentWeather(lat, lon).then((res) => {
      const data = res.data;
      const weatherType = getKoreanWeatherDescription(data.weather[0].description);

      axios
        .get(`${API_BASE_URL}/api/weather/message`, {
          params: { weatherType, feelsLike: data.main.feels_like },
        })
        .then((res) => {
          const fit = res.data.weatherFit?.split(",") || [];
          setFitList(fit);
        })
        .catch(() => {
          setFitList([]);
        });
    });
  };

  const fetchPlaceList = async (category = "AT4", keyword = "") => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const categoryCode = categoryCodeMap[category] || "AT4";

        fetchWeatherFitList(lat, lon);

        let url = `${API_BASE_URL}/api/kakao/places?lat=${lat}&lon=${lon}`;
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
                const [imageRes, ratingRes] = await Promise.all([
                  fetch(
                    `${API_BASE_URL}/api/google/image?name=${encodeURIComponent(
                      place.placeName
                    )}&lat=${place.y}&lon=${place.x}`
                  ),
                  fetch(`${API_BASE_URL}/api/opinions/rating?placeId=${place.id}`),
                ]);

                const imageUrl = await imageRes.text();
                const rating = await ratingRes.json();

                return {
                  ...place,
                  imageUrl,
                  rating: isNaN(rating) || rating === null ? 0 : rating,
                };
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

  useEffect(() => {
    fetchBookmarks();
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

    if (!token) {
      setModalMessage("로그인 후 이용할 수 있는 기능입니다.");
      setShowModal(true);
      return;
    }

    try {
      if (bookmarkId) {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          await fetchBookmarks();
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: placeKey, placeName: place.placeName }),
        });
        if (res.ok) {
          await fetchBookmarks();
        }
      }
    } catch (err) {
      console.error("북마크 처리 실패:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div className="search">
        <input type="text" placeholder="장소 이름 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={() => fetchPlaceList(selectedCategory, keyword)}>🔍</button>
      </div>

      {fitList.length > 0 && (
        <div className="recommend-toolbar">
          <div className="today-fitlist">
            <span className="fit-label">
              오늘의 추천 장소 [{fitList[0].split(":")[0]}] :
            </span>
            {fitList
              .slice(1)
              .filter((fit, idx, arr) => arr.indexOf(fit) === idx)
              .map((fit, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setKeyword(fit);
                    fetchPlaceList("", fit);
                  }}
                  className="label-button"
                >
                  {fit}
                </button>
              ))}
          </div>
          <div className="category-list">
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
        </div>
      )}

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
                  <span className="place-name-text">{place.placeName}</span>
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
                    <span style={{ marginLeft: "8px" }}>⭐ {place.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Bootstrap 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p>{modalMessage}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowModal(false)}>
              확인
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TodayPlaceList;
