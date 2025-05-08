import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NoticeList() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0); // 전체 게시글 수
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
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>공지사항</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>번호</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>제목</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {notices.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>등록된 공지가 없습니다.</td>
            </tr>
          ) : (
            notices.map((notice, index) => (
              <tr key={notice.noticeId} onClick={() => navigate(`/notice/${notice.noticeId}`)} style={{ cursor: "pointer" }}>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  {totalElements - ((page - 1) * pageSize + index)}
                </td>
                <td style={{ padding: "8px" }}>{notice.title}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  {new Date(notice.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false 
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            disabled={num === page}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: num === page ? "#5B8DEF" : "#eee",
              color: num === page ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {num}
          </button>
        ))}
        <button
  onClick={() => navigate("/noticeform")}
  style={{
    padding: "8px 16px",
    backgroundColor: "#5B8DEF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }}
>
  공지 작성
</button>
      </div>
    </div>
  );
}

export default NoticeList;