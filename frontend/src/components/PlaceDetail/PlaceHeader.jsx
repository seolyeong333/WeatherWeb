// components/PlaceDetail/PlaceHeader.jsx
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

function PlaceHeader({ place, isBookmarked, toggleBookmark, openPlaceReportModal }) {
  return (
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
  );
}

export default PlaceHeader;
