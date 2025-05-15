import { Modal, Button } from "react-bootstrap";

function AdminCommentReportModal({ show, onHide, report }) {
  if (!report) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>💬 한줄평 신고 상세</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>신고자:</strong> {report.reporterNickname}</p>
        <p><strong>신고된 한줄평:</strong> {report.commentText}</p>
        <p><strong>신고 사유:</strong> {report.content}</p>
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

export default AdminCommentReportModal;
