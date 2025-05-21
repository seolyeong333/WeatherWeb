// src/components/MyPage/BookmarkTab.jsx
import { Card, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BookmarkTab({ userInfo }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 상태
  const itemsPerPage = 10; // ✅ 한 페이지당 항목 수
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.userId) return;

    const fetchBookmarks = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookmarkDtos = await res.json();
        setBookmarks(bookmarkDtos);
      } catch (err) {
        alert("로그인이 필요한 기능입니다");
        console.error("북마크 목록 불러오기 실패", err);
      }
    };

    fetchBookmarks();
  }, [userInfo]);

  // ✅ 상세 페이지 이동
  const handleBookmarkClick = (placeName) => {
    navigate("/today-place/place-detail", { state: { placeName } });
  };

  // ✅ 페이지네이션 관련 계산
  const totalPages = Math.ceil(bookmarks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookmarks = bookmarks.slice(startIndex, startIndex + itemsPerPage);

  // ✅ 페이지 번호 클릭 시
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">📌 내가 저장한 북마크</h5>

        {currentBookmarks.length > 0 ? (
          <>
            <ul className="list-unstyled">
              {currentBookmarks.map((bookmark) => (
                <li key={bookmark.bookmarkId} className="list-item">
                  <div className="list-header">
                    <div className="list-text">
                      <div><strong>📍 장소 이름:</strong> {bookmark.placeName}</div>
                      <div><strong>🕒 저장일:</strong> {bookmark.createdAt?.slice(0, 10)}</div>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleBookmarkClick(bookmark.placeName)}
                    >
                      상세 보기
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* ✅ 페이지네이션 UI */}
            {totalPages > 1 && (
              <Pagination className="justify-content-center mt-3">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </>
        ) : (
          <p>북마크한 장소가 없습니다.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default BookmarkTab;
