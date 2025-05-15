import { useState } from "react";
import "./notice.css";


function NoticeForm({ onBack }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return setMessage("제목과 내용을 모두 입력하세요.");

    try {
      const res = await fetch("http://localhost:8080/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setMessage("공지 등록 완료!");
        onBack();
      } else {
        setMessage("공지 등록 실패.");
      }
    } catch {
      setMessage("서버 오류");
    }
  };

  return (
    <section className="notice-section">
      <h2>공지 등록</h2>
      <form className="notice-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="제목 입력" value={title} onChange={(e) => setTitle(e.target.value)} className="notice-input" />
        <textarea placeholder="내용 입력" value={content} onChange={(e) => setContent(e.target.value)} className="notice-textarea" />
        <button type="submit" className="notice-submit-btn">등록하기</button>
        <button type="button" onClick={onBack} className="notice-cancel-btn">목록</button>
      </form>
      {message && <p className="notice-message">{message}</p>}
    </section>
  );
}

export default NoticeForm;
