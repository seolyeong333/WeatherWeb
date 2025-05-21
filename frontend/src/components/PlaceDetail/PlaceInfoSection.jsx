// components/PlaceDetail/PlaceInfoSection.jsx
import { useLocation, useNavigate } from "react-router-dom";
import OpinionList from "./OpinionList";
import OpinionForm from "./OpinionForm";

function PlaceInfoSection({
  place,
  averageRating,
  renderStars,
  opinions,
  handleLikeDislike,
  openReportModal,
  opinion,
  setOpinion,
  rating,
  setRating,
  handleOpinionSubmit,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // state에서 이전 검색 조건 복구
  const fromState = location.state;

  const handleBackClick = () => {
    if (fromState?.keyword || fromState?.weather || fromState?.page) {
      // 검색 조건이 있었던 경우 해당 조건으로 목록 복원
      navigate("/today-place/list", {
        state: {
          keyword: fromState.keyword || "",
          weather: fromState.weather || "",
          page: fromState.page || 1,
        },
      });
    } else {
      // 없으면 기본 목록으로
      navigate("/today-place/list");
    }
  };

  return (
    <section className="section-2">
      <h3 className="place-subtitle">{place.placeName}</h3>

      <div className="info-block">
        <div className="info-row">
          <span className="info-label">🏷️ 분류</span>
          <span className="info-value">{place.categoryName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">📍 지번 주소</span>
          <span className="info-value">{place.addressName}</span>
        </div>
        {place.roadAddressName && (
          <div className="info-row">
            <span className="info-label">🛣️ 도로명 주소</span>
            <span className="info-value">{place.roadAddressName}</span>
          </div>
        )}
        {place.phone && (
          <div className="info-row">
            <span className="info-label">📞 전화번호</span>
            <span className="info-value">{place.phone}</span>
          </div>
        )}
      </div>

      <a
        className="kakao-link-button"
        href={place.placeUrl}
        target="_blank"
        rel="noreferrer"
      >
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

      <button className="back-btn mt-4" onClick={handleBackClick}>
        ← 추천 목록으로 돌아가기
      </button>
    </section>
  );
}

export default PlaceInfoSection;
