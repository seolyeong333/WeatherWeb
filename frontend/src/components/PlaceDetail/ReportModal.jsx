import React, { useState } from "react";
import { Modal, ListGroup, Form, Button } from "react-bootstrap";

const opinionReasons = ["욕설", "광고", "도배", "개인정보 노출", "기타"];
const placeReasons = ["정보 오류", "부적절한 장소", "폐업/이전", "기타"];

function ReportModal({ show, onHide, onSelect, type = "opinion" }) {
  const reasons = type === "place" ? placeReasons : opinionReasons;
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  // ✅ 모달 메시지용 상태
  const [modalMessage, setModalMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleSubmit = () => {
    if (selectedReason === "기타" && !customReason.trim()) {
      setModalMessage("사유를 입력해주세요.");
      setShowMessageModal(true);
      return;
    }
    const finalReason = selectedReason === "기타" ? customReason : selectedReason;
    onSelect(finalReason);
    setSelectedReason(null);
    setCustomReason("");
  };

  const handleCancel = () => {
    setSelectedReason(null);
    setCustomReason("");
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>신고 사유 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {reasons.map((reason) => (
              <ListGroup.Item
                action
                active={selectedReason === reason}
                key={reason}
                onClick={() => setSelectedReason(reason)}
              >
                {reason}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {selectedReason === "기타" && (
            <Form.Control
              className="mt-3"
              placeholder="사유를 입력해주세요"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleSubmit} disabled={!selectedReason}>
            신고 제출
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ❗입력 누락 시 경고용 모달 */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p style={{ fontSize: "1.1rem", margin: 0 }}>{modalMessage}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowMessageModal(false)}>
              확인
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ReportModal;
