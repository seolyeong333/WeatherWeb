import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/notices/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("공지 로딩 실패:", err);
      }
    };
    fetchNotice();
  }, [id]);

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/notices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId: id, title, content }),
      });

      if (res.ok) {
        alert("수정 완료!");
        navigate(`/notice/${id}`);
      } else {
        alert("수정 실패");
      }
    } catch (err) {
      console.error("수정 중 오류:", err);
      alert("오류 발생");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>공지 수정</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: "200px", padding: "10px" }}
        />
        <button type="submit" style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#5B8DEF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          수정 완료
        </button>
      </form>
    </div>
  );
}

export default NoticeEdit;
