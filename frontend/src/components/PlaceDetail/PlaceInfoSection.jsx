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
      <p className="description">
        📍 {place.addressName} <br />
        📞 {place.phone || "전화번호 없음"} <br />
      </p>

      {averageRating !== null ? (
        <div className="rating-text">
          ⭐ 평점: {averageRating.toFixed(1)} &nbsp; {renderStars(averageRating)}
        </div>
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
  );
}

export default PlaceInfoSection;
