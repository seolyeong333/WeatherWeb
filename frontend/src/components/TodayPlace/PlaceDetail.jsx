import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentWeather } from "../../api/weather";
import "./PlaceDetail.css";
import { useState, useEffect } from "react";

function PlaceDetail() {
  const { state } = useLocation();
  const place = state?.place;
  const latitude = place.y;
  const longitude = place.x;

  const navigate = useNavigate();

  const [weather, setWeather] = useState({
      temp: 0,          // 현재 온도
      feels_like: 0     // 체감 온도
  });
  const [message, setMessage] = useState("오늘은 구름이 끼고, 비가 올 가능성은 대체로 없어서 야외를 추천해요. 비가 자주 오는 날씨라면 실내 장소는 어떨까요?");
  const [fitList, setFitList] = useState([
              "더현대 서울",
              "코엑스",
              "뮤지엄",
              "수원 스파플렉스",
              "롯데월드"
            ]);

  useEffect(() => {
    if (!place) return;

     // 위치의 현 날씨
    getCurrentWeather(latitude, longitude).then((res) => {
      const data = res.data;
      console.log("현재 날씨:", data);

      const temp = data.main.temp;
      const feeling = data.main.feels_like;
      const weatherType = data.weather[0].description;

      setWeather({
        temp,
        feeling
      });

      // DB 문구 가져오기
      axios.get(`/api/weather/message`, {
        params: {
          weatherType,
          feeling
        }
      })
      .then((res) => {
        setMessage(res.data.message);
        setFitList(res.data.weatherFit.split(",") || []);
      });
    });
  }, [place]);

  if (!place) return <div className="error">잘못된 접근입니다.</div>;

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
                <button className="fit-tag" key={name}>{name}</button>
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
          {/* 댓글 입력창 또는 리스트는 추후 추가 */}
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
      </section>
    </div>
  );
}

export default PlaceDetail;
