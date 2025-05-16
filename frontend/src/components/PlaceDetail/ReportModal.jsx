// src/components/PlaceDetail/ReportModal.jsx
import React, { useState } from "react";
import { Modal, ListGroup, Form, Button } from "react-bootstrap";

const opinionReasons = ["욕설", "광고", "도배", "개인정보 노출", "기타"];
const placeReasons = ["정보 오류", "부적절한 장소", "폐업/이전", "기타"];

function ReportModal({ show, onHide, onSelect, type = "opinion" }) {
  const reasons = type === "place" ? placeReasons : opinionReasons;
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    if (selectedReason === "기타" && !customReason.trim()) {
      alert("사유를 입력해주세요");
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
  );
}

export default ReportModal;