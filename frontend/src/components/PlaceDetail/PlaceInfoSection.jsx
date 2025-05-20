// components/PlaceDetail/PlaceInfoSection.jsx
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
  navigate
}) {
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
        { place.roadAddressName &&
        <div className="info-row">
          <span className="info-label">🛣️ 도로명 주소</span>
          <span className="info-value">{place.roadAddressName}</span>
        </div> }
        {place.phone &&
        <div className="info-row">
          <span className="info-label">📞 전화번호</span>
          <span className="info-value">{place.phone}</span>
        </div> }
      </div>

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
  );
}

export default PlaceInfoSection;
