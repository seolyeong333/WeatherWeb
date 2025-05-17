import { useEffect, useState } from "react";
import "./notice.css";


function NoticeEdit({ id, onBack }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/notices/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(err => console.error("공지 불러오기 실패:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/api/notices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noticeId: id, title, content }),
    });

    if (res.ok) {
      alert("수정 완료!");
      onBack();
    } else {
      alert("수정 실패");
    }
  };

  return (
    <section className="notice-section">
      <div className="notice-content-box">
        <h2 className="notice-title">공지 수정</h2>
        <form className="notice-form" onSubmit={handleSubmit}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="notice-input" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="notice-textarea" />
          <button type="submit" className="notice-btn blue">수정 완료</button>
          <button type="button" onClick={onBack} className="notice-btn gray">취소</button>
        </form>
      </div>
    </section>
  );
}

export default NoticeEdit;
