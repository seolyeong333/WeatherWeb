import { useEffect, useState } from "react";
import { Modal, Button as BsButton } from "react-bootstrap"; // ✅ Modal과 Button import
import "../../styles/notice.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function NoticeEdit({ id, onBack }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✅ 모달 상태 추가
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // ✅ 모달 제어 함수
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  useEffect(() => {
    // 수정할 공지사항 데이터 불러오기
    const fetchNoticeData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notices/${id}`);
        if (!res.ok) {
          throw new Error("공지사항 정보를 불러오지 못했습니다.");
        }
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("공지 불러오기 실패:", err);
        handleShowModal("오류", err.message || "공지사항 정보를 불러오는 데 실패했습니다.");
      }
    };

    if (id) { // id가 있을 때만 데이터 로드
      fetchNoticeData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      handleShowModal("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token"); // ✅ 인증 토큰 가져오기
    if (!token) {
      handleShowModal("인증 오류", "로그인이 필요합니다. 다시 로그인해주세요.");
      // onBack(); 또는 로그인 페이지로 이동
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ 인증 헤더 추가
        },
        body: JSON.stringify({ noticeId: id, title, content }),
      });

      if (res.ok) {
        handleShowModal("수정 완료", "공지사항이 성공적으로 수정되었습니다.");
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || "수정에 실패했습니다. 다시 시도해주세요.";
        handleShowModal("수정 실패", errorMessage);
      }
    } catch (error) {
      console.error("수정 처리 중 예외 발생:", error);
      handleShowModal("수정 오류", "수정 처리 중 예기치 않은 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <section className="notice-section">
        <div className="notice-content-box">
          <h2 className="notice-title">공지 수정</h2>
          <form className="notice-form" onSubmit={handleSubmit}>
            <label htmlFor="notice-edit-title" className="form-label">제목</label>
            <input
              id="notice-edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="notice-input"
              placeholder="제목을 입력하세요"
            />
            <label htmlFor="notice-edit-content" className="form-label mt-3">내용</label>
            <textarea
              id="notice-edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="notice-textarea"
              rows="10"
              placeholder="내용을 입력하세요"
            />
            <div className="notice-btn-group mt-3">
              <button type="submit" className="notice-btn blue">수정 완료</button>
              <button type="button" onClick={onBack} className="notice-btn gray">취소</button>
            </div>
          </form>
        </div>
      </section>

      {/* 알림용 Modal 컴포넌트 */}
      <Modal 
        show={showModal} 
        onHide={() => {
          handleCloseModal();
          // "수정 완료" 모달이 닫힐 때 목록으로 돌아가도록 onBack 호출
          if (modalTitle === "수정 완료") {
            onBack();
          }
        }} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <BsButton 
            variant="secondary" 
            onClick={() => {
              handleCloseModal();
              if (modalTitle === "수정 완료") {
                onBack();
              }
            }}
          >
            닫기
          </BsButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NoticeEdit;