import { useEffect, useState } from "react";
import { Modal, Button as BsButton } from "react-bootstrap";
import "../../styles/notice.css";
import { getUserAuth } from "../../api/jwt";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function NoticeDetail({ id, onBack, onEdit }) {
  const [notice, setNotice] = useState(null);
  const isAdmin = getUserAuth() === "ADMIN";

  // 알림 모달 상태
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const [infoModalMessage, setInfoModalMessage] = useState("");

  // ✅ 확인 모달 상태 추가
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmActionCallback, setConfirmActionCallback] = useState(null); // 실행할 콜백 함수 저장

  // 알림 모달 제어 함수
  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = (title, message) => {
    setInfoModalTitle(title);
    setInfoModalMessage(message);
    setShowInfoModal(true);
  };

  // ✅ 확인 모달 제어 함수 추가
  const openConfirmModal = (message, callback) => {
    setConfirmModalMessage(message);
    setConfirmActionCallback(() => callback); // 콜백 함수를 저장 (주의: 함수 자체를 저장)
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmActionCallback(null); // 콜백 초기화
  };

  const handleConfirm = () => {
    if (confirmActionCallback) {
      confirmActionCallback(); // 저장된 콜백 실행
    }
    closeConfirmModal();
  };


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/notices/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("공지사항 정보를 불러오지 못했습니다.");
        return res.json();
      })
      .then(setNotice)
      .catch(err => {
        console.error("공지 상세 로딩 실패:", err);
        handleShowInfoModal("오류", err.message || "공지사항을 불러오는 중 오류가 발생했습니다.");
      });
  }, [id]);

  // ✅ 실제 삭제 로직을 수행하는 함수
  const performDelete = async () => {
    try {
      const token = localStorage.getItem("token"); // 삭제 시 토큰 필요 가정
      const res = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
        method: "DELETE",
        headers: {
           'Authorization': `Bearer ${token}` // 관리자 기능이므로 인증 토큰 추가
        }
      });

      if (res.ok) {
        handleShowInfoModal("삭제 완료", "공지사항이 삭제되었습니다.");
        onBack(); // 삭제 성공 후 목록으로
      } else {
        const errorData = await res.json().catch(() => ({ message: "삭제에 실패했습니다. 응답 내용을 확인할 수 없습니다." }));
        const errorMessage = errorData.message || "삭제에 실패했습니다. 다시 시도해주세요.";
        handleShowInfoModal("삭제 실패", errorMessage);
      }
    } catch (error) {
      console.error("삭제 처리 중 예외 발생:", error);
      handleShowInfoModal("삭제 오류", "삭제 처리 중 예기치 않은 오류가 발생했습니다.");
    }
  };

  // ✅ handleDelete는 이제 확인 모달을 띄우는 역할만 함
  const handleDelete = () => {
    openConfirmModal("정말 이 공지사항을 삭제하시겠습니까?", performDelete);
  };


  if (!notice && !showInfoModal && !showConfirmModal) {
    return <div className="notice-section"><p>로딩 중...</p></div>;
  }

  return (
    <>
      <section className="notice-section">
        {notice ? (
          <div className="notice-content-box">
            <h2 className="notice-title">{notice.title}</h2>
            <p className="notice-date">{new Date(notice.createdAt).toLocaleString("ko-KR")}</p>
            <hr />
            <div className="notice-content" dangerouslySetInnerHTML={{ __html: notice.content?.replace(/\n/g, '<br />') || '' }}></div>
            <div className="notice-btn-group">
              <button className="notice-btn gray" onClick={onBack}>목록으로</button>
              {isAdmin && <button className="notice-btn blue" onClick={() => onEdit(id)}>수정</button>}
              {isAdmin && <button className="notice-btn red" onClick={handleDelete}>삭제</button>}
            </div>
          </div>
        ) : (
          !showInfoModal && !showConfirmModal && <p>공지사항 정보를 표시할 수 없습니다.</p>
        )}
      </section>

      {/* 알림용 Modal */}
      <Modal show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{infoModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{infoModalMessage}</Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={handleCloseInfoModal}>
            닫기
          </BsButton>
        </Modal.Footer>
      </Modal>

      {/* ✅ 삭제 확인용 Modal */}
      <Modal show={showConfirmModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModalMessage}</Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={closeConfirmModal}>
            아니오
          </BsButton>
          <BsButton variant="danger" onClick={handleConfirm}> {/* "예" 버튼 클릭 시 handleConfirm 실행 */}
            예, 삭제합니다
          </BsButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NoticeDetail;