import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NoticeForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setMessage("제목과 내용을 모두 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        setMessage("공지 등록 완료!");
        navigate("/noticelist");
      } else {
        setMessage("공지 등록 실패.");
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setMessage("서버 오류");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>공지 등록</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="내용 입력"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: "200px", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          등록하기
        </button>
        <button onClick={() => navigate("/noticelist")} style={{ width: "100%", padding: "10px" }}>
          목록
        </button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "blue" }}>{message}</p>}
    </div>
  );
}


export default NoticeForm;