import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentWeather } from "../../api/weather";
import "./PlaceDetail.css";
import { useState, useEffect } from "react";
import axios from "axios";

// 날씨 영어 → 한글 매핑
const weatherDescriptionMap = {
  "튼구름": "구름 많음",
  "맑음": "맑음",
  "비": "비",
  "눈": "눈",
  "실 비": "이슬비",
  "소나기": "소나기",
  "천둥번개": "뇌우",
  "연무": "흐림",
  "흐림": "흐림",
  "온흐림": "흐림",
  "박무": "흐림",
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

  // 📌 placeId만 전달된 경우, 백엔드에서 장소 상세 정보 fetch
  useEffect(() => {
    if (place) return; // 이미 place가 있으면 fetch 안함

    const placeId = state?.placeId;
    if (!placeId) return;

    fetch(`http://localhost:8080/api/kakao/place?placeId=${placeId}`)
      .then((res) => res.json())
      .then(setPlace)
      .catch((err) => {
        console.error("장소 정보 불러오기 실패", err);
        alert("장소 정보를 불러오지 못했습니다.");
        navigate("/main");
      });
  }, [state, place]);

  // 📌 날씨 및 메시지 로딩
  useEffect(() => {
    if (!place?.x || !place?.y) return;

    getCurrentWeather(place.y, place.x).then((res) => {
      const data = res.data;
      const temp = data.main.temp;
      const feeling = data.main.feels_like;
      const rawDesc = data.weather[0].description;
      const weatherType = getKoreanWeatherDescription(rawDesc);

      setWeather({ temp, feeling });

      axios
        .get("http://localhost:8080/api/weather/message", {
          params: { weatherType, feelsLike: feeling },
        })
        .then((res) => {
          setMessage(res.data.message || "추천 메시지를 불러오지 못했습니다.");
          setFitList(res.data.weatherFit?.split(",") || []);
        })
        .catch((err) => {
          console.error("메시지 불러오기 실패:", err);
          setMessage("추천 메시지를 불러오지 못했습니다.");
        });
    });
  }, [place]);

  const handleOpinionSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const res = await fetch("http://localhost:8080/api/opinions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          placeId: place.id,
          content: opinion,
          isPublic: true,
        }),
      });

      if (!res.ok) throw new Error("작성 실패");

      alert("한줄평이 등록되었습니다!");
      setOpinion(""); // 입력값 초기화
    } catch (err) {
      console.error("의견 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  if (!place) return <div className="error">장소 정보를 불러오는 중입니다...</div>;

  return (
    <div className="place-detail-wrapper">
      {/* Section 3: 상단 추천 + 날씨 */}
      <h2 className="place-title">{place.placeName}</h2>
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
                <button className="fit-tag" key={name}>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 2: 장소 상세 */}
      <section className="section-2">
        <h3 className="place-subtitle">{place.placeName}</h3>
        <p className="description">
          📍 {place.addressName} <br />
          📞 {place.phone || "전화번호 없음"}
        </p>
        <a
          className="kakao-link-button"
          href={place.placeUrl}
          target="_blank"
          rel="noreferrer"
        >
          🔗 카카오맵에서 보기
        </a>

        <div className="opinion-box">
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

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </section>
    </div>
  );
}

export default PlaceDetail;
