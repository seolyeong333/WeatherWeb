// src/components/MyPage/BookmarkTab.jsx
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BookmarkTab({ userInfo }) {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!userInfo?.userId) return;

    const fetchBookmarksWithDetails = async () => {
        const token = localStorage.getItem("token");

        try {
        // 1. 북마크 목록 가져오기 (BookMarkDto[])
        const res = await fetch(`http://localhost:8080/api/bookmarks`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const bookmarkDtos = await res.json();
        const detailedPlaces = await Promise.all(
        bookmarkDtos.map(async (bookmark) => {
          const placeId = bookmark.placeId;

          const detailRes = await fetch(
            `http://localhost:8080/api/bookmarks/place-detail?placeId=${placeId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!detailRes.ok) {
            const errorText = await detailRes.text();
            console.warn(`❌ ${placeId} 상세 조회 실패: ${errorText}`);
            return null;
          }

          // ⚠ JSON 파싱 실패 방지
          let place;
          try {
            place = await detailRes.json();
          } catch (jsonErr) {
            console.warn(`⚠ JSON 파싱 실패 (placeId=${placeId})`, jsonErr);
            return null;
          }

          const imageRes = await fetch(
            `http://localhost:8080/api/google/image?name=${encodeURIComponent(place.placeName)}&lat=${place.y}&lon=${place.x}`
          );
          const imageUrl = await imageRes.text();

          return {
            ...place,
            imageUrl,
            bookmarkId: bookmark.bookmarkId,
            createdAt: bookmark.createdAt,
          };
        })
      );

      // ❗ null 필터링
      const filtered = detailedPlaces.filter((p) => p !== null);
      setBookmarks(filtered);
    } catch (err) {
      console.error("북마크 저장 목록 불러오기 실패", err);
    }
  };

  fetchBookmarksWithDetails();
}, [userInfo]);

  // 🔸 클릭 시 placeId를 넘기며 상세페이지로 이동
  const handleOpinionClick = (placeId) => {
    navigate("/today-place/place-detail", { state: { placeId } }); // 🔗 이동 시 state로 전달
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">💬 나의 북마크 목록</h5>
        {bookmarks.length > 0 ? (
          <ul className="list-group list-group-flush">
            {bookmarks.map((place) => (
              <li
                key={place.placeId}
                onClick={() => handleOpinionClick(place.placeId)} // ✅ 클릭 시 이동
                className="list-group-item d-flex flex-column align-items-start"
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>📍 장소 ID:</strong> {bookmark.placeId}
                </div>
                <div className="bookmark-image">
                    <img
                        src={place.imageUrl || "/no-image.jpg"}
                        alt={place.placeName}
                        onError={(e) => (e.target.src = "/no-image.jpg")}
                    />
                </div>
                <div>
                  <strong>{place.placeName}</strong> 
                  <p>{place.roadAddress || place.addressName}</p>
                  <p className="bookmark-date">저장일: {place.createdAt?.slice(0, 10)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>저장한 북마크가 없습니다.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default BookmarkTab;
