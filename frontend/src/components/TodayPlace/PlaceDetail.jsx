import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentWeather } from "../../api/weather";
import "./PlaceDetail.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ReportModal from "../../components/ReportModal"; // ✅ 모달 컴포넌트 import

const weatherDescriptionMap = {
  "튼구름": "구름 많음", "맑음": "맑음", "비": "비", "눈": "눈",
  "실 비": "이슬비", "소나기": "소나기", "천둥번개": "뇌우",
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
  const [opinions, setOpinions] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetId, setReportTargetId] = useState(null);

  const fetchOpinions = async () => {
    if (!place?.id) return;
    const res = await fetch(`http://localhost:8080/api/opinions/place?placeId=${place.id}`);
    const data = await res.json();
    setOpinions(data);
  };

  useEffect(() => {
    if (place) return;
    const placeName = state?.placeName;
    if (!placeName) return;

    fetch(`http://localhost:8080/api/kakao/place?placeName=${encodeURIComponent(placeName)}`)
      .then((res) => res.json())
      .then(setPlace)
      .catch((err) => {
        console.error("장소 정보 실패", err);
        navigate("/main");
      });
  }, [state, place]);

  useEffect(() => {
    if (!place?.x || !place?.y) return;
    getCurrentWeather(place.y, place.x).then((res) => {
      const data = res.data;
      const temp = data.main.temp;
      const feeling = data.main.feels_like;
      const rawDesc = data.weather[0].description;
      const weatherType = getKoreanWeatherDescription(rawDesc);

      setWeather({ temp, feeling });

      axios.get("http://localhost:8080/api/weather/message", {
        params: { weatherType, feelsLike: feeling }
      })
        .then((res) => {
          setMessage(res.data.message || "추천 메시지를 불러오지 못했습니다.");
          setFitList(res.data.weatherFit?.split(",") || []);
        })
        .catch((err) => {
          console.error("메시지 실패:", err);
          setMessage("추천 메시지를 불러오지 못했습니다.");
        });
    });
  }, [place]);

  useEffect(() => {
    fetchOpinions();
  }, [place]);

  const handleOpinionSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("로그인이 필요합니다.");

      const res = await fetch("http://localhost:8080/api/opinions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placeId: place.id,
          placeName: place.placeName,
          content: opinion,
          isPublic: true,
        }),
      });

      if (!res.ok) throw new Error("작성 실패");
      alert("등록 완료!");
      setOpinion("");
      await fetchOpinions();
    } catch (err) {
      console.error("등록 실패:", err);
      alert("등록 중 오류 발생");
    }
  };

  const handleLikeDislike = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("로그인이 필요합니다.");

      const res = await fetch(`http://localhost:8080/api/opinions/${id}/${type}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchOpinions();
      else alert(`${type === "like" ? "좋아요" : "싫어요"} 실패`);
    } catch (err) {
      console.error(`${type} 실패`, err);
    }
  };

  const openReportModal = (id) => {
    setReportTargetId(id);
    setShowReportModal(true);
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
          targetType: "opinion",
          targetId: reportTargetId,
          content: reason,
        }),
      });

      if (res.ok) alert("신고가 접수되었습니다.");
      else alert("신고에 실패했습니다.");
    } catch (err) {
      console.error("신고 실패:", err);
      alert("신고 중 오류 발생");
    }
  };

  if (!place) return <div className="error">장소 정보를 불러오는 중입니다...</div>;

  return (
    <div className="place-detail-wrapper">
      <h2 className="place-title">{place.placeName}</h2>

      {/* 날씨 */}
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
                <button className="fit-tag" key={name}>{name}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 상세정보 및 한줄평 */}
      <section className="section-2">
        <h3 className="place-subtitle">{place.placeName}</h3>
        <p className="description">
          📍 {place.addressName} <br />
          📞 {place.phone || "전화번호 없음"}
        </p>
        <a className="kakao-link-button" href={place.placeUrl} target="_blank" rel="noreferrer">
          🔗 카카오맵에서 보기
        </a>

        <div className="opinion-list mt-4">
          <h4>💬 한줄평</h4>
          {opinions.length === 0 ? (
            <p className="text-muted">등록된 한줄평이 없습니다.</p>
          ) : (
            <ul className="list-group">
              {opinions.map((op) => (
                <li key={op.opinionId} className="list-group-item">
                  <div><strong>{op.content}</strong></div>
                  <div className="d-flex gap-2 mt-1 small text-muted align-items-center">
                    <span>👍 {op.likes}</span>
                    <span>👎 {op.dislikes}</span>
                    <span>🕒 {op.createdAt?.substring(0, 16)}</span>
                    <button className="btn btn-sm btn-outline-success" onClick={() => handleLikeDislike(op.opinionId, "like")}>👍</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleLikeDislike(op.opinionId, "dislike")}>👎</button>
                    <button className="btn btn-sm btn-outline-warning" onClick={() => openReportModal(op.opinionId)}>🚨</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="opinion-box mt-4">
          <p>여러분들의 의견을 남겨주세요.</p>
          <textarea
            className="form-control mt-2"
            rows="3"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="한줄평을 입력해주세요"
          />
          <button
            className="btn btn-primary mt-2"
            onClick={handleOpinionSubmit}
            disabled={!opinion.trim()}
          >
            등록하기
          </button>
        </div>

        <button className="back-btn mt-4" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </section>

      {/* 🚨 신고 모달 */}
      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        onSelect={handleReport}
      />
    </div>
  );
}

export default PlaceDetail;
