import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/notices/${id}`);
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        console.error("공지 상세 로딩 실패:", err);
      }
    };
    fetchNotice();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/notices/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("삭제되었습니다.");
        navigate("/noticelist"); // 공지 목록으로 이동
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 중 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!notice) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>{notice.title}</h2>
      <p style={{ color: "#888" }}>{new Date(notice.createdAt).toLocaleString()}</p>
      <hr />
      <p>{notice.content}</p>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/noticelist")}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          목록으로
        </button>

        <button
            onClick={() => navigate(`/notice/edit/${id}`)}  // 수정 페이지로 이동
            style={{
                marginRight: "10px",
                padding: "8px 16px",
                backgroundColor: "#5B8DEF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
            }}
            >
            수정
        </button>


        <button
          onClick={handleDelete}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default NoticeDetail;
