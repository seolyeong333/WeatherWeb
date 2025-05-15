import { Modal, Button } from "react-bootstrap";

function AdminPlaceReportModal({ show, onHide, report }) {
  if (!report) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>📍 장소 신고 상세</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>신고자:</strong> {report.reporterNickname}</p>
        <p><strong>장소명:</strong> {report.placeName}</p>
        <p><strong>신고 사유:</strong> {report.reason}</p>
        <p><strong>신고 상태:</strong> {report.status}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>닫기</Button>
        <Button variant="danger" onClick={() => alert("삭제 처리")}>삭제</Button>
        <Button variant="warning" onClick={() => alert("수정 처리")}>수정</Button>
        <Button variant="outline-secondary" onClick={() => alert("무시 처리")}>무시</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdminPlaceReportModal;
