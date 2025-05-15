import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "./notice.css"; // ✅ 스타일 적용

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 공지 불러오기
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
    <div>
      <Header />
      <section className="notice-section">
        <div className="notice-content-box">
          <h2 className="notice-title">공지 수정</h2>
          <form onSubmit={handleSubmit} className="notice-form">
            <input
              type="text"
              placeholder="제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="notice-input"
            />
            <textarea
              placeholder="내용 입력"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="notice-textarea"
            />
            <button type="submit" className="notice-btn blue">
              수정 완료
            </button>
            <button
              type="button"
              className="notice-btn gray"
              onClick={() => navigate(`/notice/${id}`)}
            >
              취소
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default NoticeEdit;
