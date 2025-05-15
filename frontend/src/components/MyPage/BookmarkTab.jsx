// src/components/MyPage/BookmarkTab.jsx
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BookmarkTab({ userInfo }) {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate(); // ✅ navigate 추가

  useEffect(() => {
    if (!userInfo?.userId) return;

    const fetchBookmarks = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:8080/api/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookmarkDtos = await res.json();
        setBookmarks(bookmarkDtos);
      } catch (err) {
        console.error("북마크 목록 불러오기 실패", err);
      }
    };

    fetchBookmarks();
  }, [userInfo]);

  // ✅ 상세 페이지 이동 함수 (placeName 기반)
  const handleBookmarkClick = (placeName) => {
    navigate("/today-place/place-detail", { state: { placeName } });
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">📌 내가 저장한 북마크</h5>
        {bookmarks.length > 0 ? (
          <ul className="list-group list-group-flush">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.bookmarkId}
                onClick={() => handleBookmarkClick(bookmark.placeName)} // ✅ 클릭 시 상세페이지 이동
                className="list-group-item d-flex flex-column align-items-start"
                style={{ cursor: "pointer" }}
              >
                <div><strong>📍 장소 이름:</strong> {bookmark.placeName}</div>
                <div><strong>🕒 저장일:</strong> {bookmark.createdAt?.slice(0, 10)}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>북마크한 장소가 없습니다.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default BookmarkTab;
