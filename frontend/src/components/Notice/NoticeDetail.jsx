import { useEffect, useState } from "react";
import "../../styles/notice.css";
import { getUserAuth } from "../../api/jwt";


function NoticeDetail({ id, onBack, onEdit }) {
  const [notice, setNotice] = useState(null);
  const isAdmin = getUserAuth() === "ADMIN";
  useEffect(() => {
    fetch(`http://localhost:8080/api/notices/${id}`)
      .then(res => res.json())
      .then(setNotice)
      .catch(err => console.error("공지 상세 로딩 실패:", err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`http://localhost:8080/api/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("삭제되었습니다.");
      onBack();
    } else {
      alert("삭제에 실패했습니다.");
    }
  };

  if (!notice) return <div>로딩 중...</div>;

  return (
    <section className="notice-section">
      <div className="notice-content-box">
        <h2 className="notice-title">{notice.title}</h2>
        <p className="notice-date">{new Date(notice.createdAt).toLocaleString("ko-KR")}</p>
        <hr />
        <p className="notice-content">{notice.content}</p>
        <div className="notice-btn-group">
          <button className="notice-btn gray" onClick={onBack}>목록으로</button>
          {(isAdmin && <button className="notice-btn blue" onClick={() => onEdit(id)}>수정</button>
          )}
          {(isAdmin && <button className="notice-btn red" onClick={handleDelete}>삭제</button> )}
        </div>
      </div>
    </section>
  );
}

export default NoticeDetail;
