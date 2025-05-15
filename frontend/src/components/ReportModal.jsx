import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const reasons = ["욕설", "광고", "도배", "개인정보 노출", "기타"];

function ReportModal({ show, onHide, onSelect }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>신고 사유 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {reasons.map((reason) => (
            <ListGroup.Item
              action
              key={reason}
              onClick={() => onSelect(reason)}
            >
              {reason}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}

export default ReportModal;
