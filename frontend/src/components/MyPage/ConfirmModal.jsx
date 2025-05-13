import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ show, onHide, onConfirm, message }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onConfirm}>확인</Button>
        <Button variant="secondary" onClick={onHide}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
