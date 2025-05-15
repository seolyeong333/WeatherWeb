import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./notice.css"; // ✅ 스타일 적용

function NoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const fetchNotices = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/notices?page=${page - 1}&size=${pageSize}`);
      const data = await res.json();
      setNotices(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("공지 목록 로딩 실패:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [page]);

  return (
    <div className="notice-wrapper">
      <Header />
      <section className="notice-section">
        <h2>공지사항</h2>
        <table className="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일자</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="3" className="notice-empty">등록된 공지가 없습니다.</td>
              </tr>
            ) : (
              notices.map((notice, index) => (
                <tr key={notice.noticeId} onClick={() => navigate(`/notice/${notice.noticeId}`)}>
                  <td>{totalElements - ((page - 1) * pageSize + index)}</td>
                  <td>{notice.title}</td>
                  <td>
                    {new Date(notice.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="notice-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`notice-page-btn ${page === num ? "active" : ""}`}
            >
              {num}
            </button>
          ))}
          <button className="notice-write-btn" onClick={() => navigate("/noticeform")}>
            공지 작성
          </button>
        </div>
      </section>
    </div>
  );
}

export default NoticeList;
