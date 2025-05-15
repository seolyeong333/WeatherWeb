import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header"; // 헤더 포함
import "./notice.css"; // ✅ 감성 테마 스타일 적용

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
        navigate("/noticelist");
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
    <div>
      <Header />
      <section className="notice-section">
        <div className="notice-content-box">
          <h2 className="notice-title">{notice.title}</h2>
          <p className="notice-date">
            {new Date(notice.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
          <hr />
          <p className="notice-content">{notice.content}</p>

          <div className="notice-btn-group">
            <button className="notice-btn gray" onClick={() => navigate("/noticelist")}>
              목록으로
            </button>
            <button className="notice-btn blue" onClick={() => navigate(`/notice/edit/${id}`)}>
              수정
            </button>
            <button className="notice-btn red" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NoticeDetail;
