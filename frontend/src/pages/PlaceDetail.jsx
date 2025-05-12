import { useLocation, useNavigate } from "react-router-dom";
import "./PlaceDetail.css";

function PlaceDetail() {
  const { state } = useLocation();
  const place = state?.place;
  const navigate = useNavigate();

  if (!place) return <div className="error">잘못된 접근입니다.</div>;

  return (
    <div className="place-detail-wrapper">
      {/* Section 3: 상단 추천 + 날씨 */}
      <section className="section-3">
        <div className="place-header">
          <h2 className="place-title">{place.placeName}</h2>
          <p className="weather-question">오늘 "{place.placeName}"의 날씨는?</p>

          <div className="weather-info">
            <span className="weather-icon">🌤️</span>
            <span className="temp">18°C</span>
          </div>

          <div className="weather-summary">
            <p>오늘은 구름이 끼고, 비가 올 가능성은 대체로 없어서 야외를 추천해요.</p>
            <p>비가 자주 오는 날씨라면 실내 장소는 어떨까요?</p>
          </div>

          <div className="recommend-tags">
            <span className="recommend-label">웨더핏 추천:</span>
            {[
              "더현대 서울",
              "코엑스",
              "뮤지엄",
              "수원 스파플렉스",
              "롯데월드"
            ].map((name) => (
              <button className="tag-button" key={name}>{name}</button>
            ))}
          </div>
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
