import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PlaceHeader from "../../components/PlaceDetail/PlaceHeader";
import PlaceWeatherSection from "../../components/PlaceDetail/PlaceWeatherSection";
import PlaceInfoSection from "../../components/PlaceDetail/PlaceInfoSection";
import ReportModal from "../../components/PlaceDetail/ReportModal";
import { getKoreanWeatherDescription } from "../../utils/weatherUtil";
import { getCurrentWeather } from "../../api/weather";
import "../../styles/TodayPlace/PlaceDetail.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const opinionReasons = ["욕설", "광고", "도배", "개인정보 노출", "기타"];
const placeReasons = ["정보 오류", "부적절한 장소", "폐업/이전", "기타"];

function PlaceDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [place, setPlace] = useState(state?.place || null);
  const [weather, setWeather] = useState({ temp: 0, feeling: 0 });
  const [message, setMessage] = useState("로딩 중...");
  const [fitList, setFitList] = useState([]);
  const [opinion, setOpinion] = useState("");
  const [rating, setRating] = useState(0);
  const [opinions, setOpinions] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetId, setReportTargetId] = useState(null);
  const [currentReportType, setCurrentReportType] = useState("opinion");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const [flagged, setFlagged] = useState(false);
  const [averageRating, setAverageRating] = useState(null);

  const fetchAverageRating = async () => {
    if (!place?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/opinions/rating?placeId=${place.id}`);
      const avg = await res.json();
      setAverageRating(avg);
    } catch {
      console.error("🌟 평균 평점 가져오기 실패");
    }
  };

  const fetchOpinions = async () => {
    if (!place?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/opinions/place?placeId=${place.id}`);
      const data = await res.json();
      setOpinions(data);
    } catch (err) {
      console.error("한줄평 로드 실패:", err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let percent = 0;
      if (rating >= i) percent = 100;
      else if (rating + 1 > i) percent = (rating - (i - 1)) * 100;

      stars.push(
        <span key={i} className="star" style={{ "--star-percent": `${percent}%` }}>
          ★
        </span>
      );
    }
    return <div className="star-wrapper">{stars}</div>;
  };

  useEffect(() => {
    if (place) return;
    const placeName = state?.placeName;
    if (!placeName) return;
    fetch(`${API_BASE_URL}/api/kakao/place?placeName=${encodeURIComponent(placeName)}`)
      .then(res => res.json())
      .then(setPlace)
      .catch(() => navigate("/main"));
  }, [state, place]);

  useEffect(() => {
    fetchOpinions();
    fetchAverageRating();
  }, [place?.id]);

  useEffect(() => {
    if (!place?.x || !place?.y) return;
    getCurrentWeather(place.y, place.x).then(res => {
      const data = res.data;
      const weatherType = getKoreanWeatherDescription(data.weather[0].description);
      setWeather({ temp: data.main.temp, feeling: data.main.feels_like });

      axios.get(`${API_BASE_URL}/api/weather/message`, {
        params: { weatherType, feelsLike: data.main.feels_like }
      })
        .then(res => {
          setMessage(res.data.message || "추천 메시지를 불러오지 못했습니다.");
          setFitList(res.data.weatherFit?.split(",") || []);
        })
        .catch(() => setMessage("추천 메시지를 불러오지 못했습니다."));
    });
  }, [place]);

  const refreshBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token || !place?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const found = data.find(b => b.placeId === place.id);
      if (found) {
        setIsBookmarked(true);
        setBookmarkId(found.bookmarkId);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    } catch (err) {
      console.error("🔁 북마크 동기화 실패:", err);
    }
  };

  useEffect(() => {
    refreshBookmark();
  }, [place]);

  useEffect(() => {
    if (!place?.placeName) return;
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/admin/reports/check-flag?placeName=${encodeURIComponent(place.placeName)}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data.flagged) setFlagged(true);
      })
      .catch((err) => console.error("🚨 flagged 확인 실패:", err));
  }, [place]);

  const toggleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      if (isBookmarked && bookmarkId) {
        await fetch(`${API_BASE_URL}/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        await refreshBookmark();
      } else {
        await fetch(`${API_BASE_URL}/api/bookmarks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: place.id, placeName: place.placeName }),
        });
        await refreshBookmark();
      }
    } catch {
      alert("북마크 처리 중 오류 발생");
    }
  };

  const handleOpinionSubmit = async ({ content, rating }) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      await fetch(`${API_BASE_URL}/api/opinions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placeId: place.id,
          placeName: place.placeName,
          content,
          rating,
          isPublic: true,
        }),
      });
      alert("등록 완료!");
      setOpinion("");
      fetchOpinions();
      fetchAverageRating();
    } catch {
      alert("등록 중 오류 발생");
    }
  };

  const handleLikeDislike = async (id, type) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`${API_BASE_URL}/api/opinions/${id}/${type}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchOpinions();
        fetchAverageRating();
      } else {
        alert(`${type === "like" ? "좋아요" : "싫어요"} 실패`);
      }
    } catch {
      alert("처리 실패");
    }
  };

  const openReportModal = (id) => {
    setReportTargetId(id);
    setShowReportModal(true);
    setCurrentReportType("opinion");
  };

  const openPlaceReportModal = () => {
    setReportTargetId(place.id);
    setShowReportModal(true);
    setCurrentReportType("place");
  };

  const handleReport = async (reason) => {
    setShowReportModal(false);
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`${API_BASE_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetType: currentReportType,
          targetId: reportTargetId,
          placeName: place.placeName,
          content: reason,
        }),
      });
      const message = await res.text();
      if (res.ok) alert("신고가 접수되었습니다.");
      else alert(message);
    } catch {
      alert("신고 중 오류 발생");
    }
  };

  if (!place) return <div className="error">장소 정보를 불러오는 중입니다...</div>;

  return (
    <div className="place-detail-wrapper">
      {flagged && (
        <div className="alert alert-danger mt-2">
          🚨 이 장소는 관리자에 의해 신고 처리된 페이지입니다.
        </div>
      )}

      <PlaceHeader
        place={place}
        isBookmarked={isBookmarked}
        toggleBookmark={toggleBookmark}
        openPlaceReportModal={openPlaceReportModal}
      />

      <PlaceWeatherSection
        place={place}
        weather={weather}
        message={message}
        fitList={fitList}
      />

      <PlaceInfoSection
        place={place}
        averageRating={averageRating}
        renderStars={renderStars}
        opinions={opinions}
        handleLikeDislike={handleLikeDislike}
        openReportModal={openReportModal}
        opinion={opinion}
        setOpinion={setOpinion}
        rating={rating}
        setRating={setRating}
        handleOpinionSubmit={handleOpinionSubmit}
        navigate={navigate}
      />

      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        onSelect={handleReport}
        type={currentReportType}
        reasons={currentReportType === "place" ? placeReasons : opinionReasons}
      />
    </div>
  );
}

export default PlaceDetail;
