import { FaRegBookmark, FaBookmark } from "react-icons/fa";

function PlaceHeader({
  place,
  isBookmarked,
  toggleBookmark,
  openPlaceReportModal,
  averageRating,
  renderStars,
}) {
  return (
    <div className="d-flex justify-content-between align-items-start mb-3">
      {/* 왼쪽: 장소 이름 + 북마크 + 평점 */}
      <div>
        <h2 className="place-title d-flex align-items-center">
          {place.placeName}
          <button
            onClick={toggleBookmark}
            className="bookmark-button-inline ms-2"
            title="북마크"
          >
            {isBookmarked ? (
              <FaBookmark size={22} color="#ffcc00" />
            ) : (
              <FaRegBookmark size={22} color="#555" />
            )}
          </button>
        </h2>

        {/* ✅ 평점 숫자 + 별점 함께 출력 */}
        <div className="rating-under-title mt-1 d-flex align-items-center gap-2">
          {averageRating !== null ? (
            <>
              {renderStars(averageRating)}
              <span className="text-dark fw-semibold"> {averageRating.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-muted">⭐ 평점 없음</span>
          )}
        </div>
      </div>

      {/* 오른쪽: 신고 버튼 */}
      <button className="btn btn-outline-danger h-50 mt-2" onClick={openPlaceReportModal}>
        🚨 장소 신고
      </button>
    </div>
  );
}

export default PlaceHeader;
