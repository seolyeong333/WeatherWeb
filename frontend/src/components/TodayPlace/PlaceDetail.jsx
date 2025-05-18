import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { getCurrentWeather } from "../../api/weather";
import axios from "axios";
import ReportModal from "../../components/PlaceDetail/ReportModal";
import OpinionForm from "../../components/PlaceDetail/OpinionForm";
import OpinionList from "../../components/PlaceDetail/OpinionList";
import "../../styles/TodayPlace/PlaceDetail.css";

const opinionReasons = ["욕설", "광고", "도배", "개인정보 노출", "기타"];
const placeReasons = ["정보 오류", "부적절한 장소", "폐업/이전", "기타"];

const weatherDescriptionMap = {
  "구름 많음": "흐림", "튼구름": "흐림", "맑음": "맑음", "비": "비", "눈": "눈", 
  "보통 비": "비", "강한 비": "비", "실 비": "이슬비", "소나기": "소나기", "천둥번개": "뇌우",
  "연무": "흐림", "흐림": "흐림", "온흐림": "흐림", "박무": "흐림"
};

function getKoreanWeatherDescription(desc) {
  return weatherDescriptionMap[desc] || "기타";
}

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
  const [flagged, setFlagged] = useState(false); // 🚨 신고 처리된 장소 여부

  const fetchOpinions = async () => {
    if (!place?.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/opinions/place?placeId=${place.id}`);
      const data = await res.json();
      setOpinions(data);
    } catch (err) {
      console.error("한줄평 로드 실패:", err);
    }
  };

  // 함수 정의 위치 (컴포넌트 내부 또는 외부에 추가 가능)
  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars).fill().map((_, i) => <span key={"full" + i}>⭐</span>)}
        {halfStar && <span key="half">⭐️½</span>}
        {Array(emptyStars).fill().map((_, i) => <span key={"empty" + i}>☆</span>)}
      </>
    );
  }


  useEffect(() => {
    if (place) return;
    const placeName = state?.placeName;
    if (!placeName) return;
    fetch(`http://localhost:8080/api/kakao/place?placeName=${encodeURIComponent(placeName)}`)
      .then(res => res.json())
      .then(setPlace)
      .catch(() => navigate("/main"));
  }, [state, place]);

  useEffect(() => {
    fetchOpinions();
  }, [place]);

  useEffect(() => {
    if (!place?.x || !place?.y) return;
    getCurrentWeather(place.y, place.x).then(res => {
      const data = res.data;
      const weatherType = getKoreanWeatherDescription(data.weather[0].description);
      setWeather({ temp: data.main.temp, feeling: data.main.feels_like });

      axios.get("http://localhost:8080/api/weather/message", {
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
      const res = await fetch("http://localhost:8080/api/bookmarks", {
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

// 🚨 처리된 장소 여부 확인 API 호출
useEffect(() => {
  if (!place?.placeName) return;

  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/api/admin/reports/check-flag?placeName=${encodeURIComponent(place.placeName)}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

    .then(async (res) => {
      if (!res.ok) {
        const errorText = await res.text(); // JSON이 아닐 수 있으므로 text()
        console.error("🚨 flagged 확인 실패:", errorText);
        return;
      }
      const data = await res.json();
      if (data.flagged) {
        setFlagged(true);
      }
    })
    .catch((err) => console.error("🚨 flagged 확인 실패:", err));
}, [place]);



  
  const toggleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      if (isBookmarked && bookmarkId) {
        const res = await fetch(`http://localhost:8080/api/bookmarks/${bookmarkId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) await refreshBookmark();
      } else {
        const res = await fetch("http://localhost:8080/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ placeId: place.id, placeName: place.placeName }),
        });
        if (res.ok) await refreshBookmark();
      }
    } catch {
      alert("북마크 처리 중 오류 발생");
    }
  };

  const handleOpinionSubmit = async ({ content, rating }) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
  
    try {
      const res = await fetch("http://localhost:8080/api/opinions", {
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
  
      if (!res.ok) throw new Error();
      alert("등록 완료!");
      setOpinion("");
      fetchOpinions();
    } catch {
      alert("등록 중 오류 발생");
    }
  };
  

  const handleLikeDislike = async (id, type) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    try {
      const res = await fetch(`http://localhost:8080/api/opinions/${id}/${type}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchOpinions();
      else alert(`${type === "like" ? "좋아요" : "싫어요"} 실패`);
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
      const res = await fetch("http://localhost:8080/api/reports", {
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
      {/* 🚨 신고 처리된 장소 경고 */}
      {flagged && (
        <div className="alert alert-danger mt-2">
          🚨 이 장소는 관리자에 의해 신고 처리된 페이지입니다. 신뢰할 수 없는 정보가 포함되어 있을 수 있습니다.
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <h2 className="place-title">
          {place.placeName}
          <button onClick={toggleBookmark} className="bookmark-button-inline" title="북마크">
          {isBookmarked ? (
            <FaBookmark size={22} color="#ffcc00" />
          ) : (
            <FaRegBookmark size={22} color="#555" />
          )}
        </button>
        </h2>
        <button className="btn btn-outline-danger" onClick={openPlaceReportModal}>
          🚨 장소 신고
        </button>
      </div>

      <section className="section-3">
        <div className="place-header">
          <p className="weather-question">오늘 "{place.placeName}"의 날씨는?</p>
          <div className="weather-middle">
            <div className="weather-icon">🌤️</div>
            <div className="weather-temp">{weather.temp}℃</div>
          </div>
          <p className="weather-message">{message}</p>
          {fitList.length > 0 && (
            <div className="recommend-tags">
              <span className="recommend-label">웨더핏 추천:</span>
              {fitList.map((name) => (
                <button
                  className="fit-tag"
                  key={name}
                  onClick={() => navigate(`/today-place/list?keyword=${encodeURIComponent(name)}`)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-2">
        <h3 className="place-subtitle">{place.placeName}</h3>
        <p className="description">
          📍 {place.addressName} <br />
          📞 {place.phone || "전화번호 없음"} <br />
        </p>
        {place.rating ? (
          <p className="rating-text">
            ⭐ 평점: {place.rating.toFixed(1)} &nbsp; {renderStars(place.rating)}
          </p>
        ) : (
          <p className="rating-text">⭐ 평점: 없음</p>
        )}

        
        <a className="kakao-link-button" href={place.placeUrl} target="_blank" rel="noreferrer">
          🔗 카카오맵에서 보기
        </a>


        <OpinionList
          opinions={opinions}
          onLike={(id) => handleLikeDislike(id, "like")}
          onDislike={(id) => handleLikeDislike(id, "dislike")}
          onReport={openReportModal}
        />

        <OpinionForm
          opinion={opinion}
          setOpinion={setOpinion}
          onSubmit={handleOpinionSubmit}
          rating={rating}
          setRating={setRating}
        />

        <button className="back-btn mt-4" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </section>

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
