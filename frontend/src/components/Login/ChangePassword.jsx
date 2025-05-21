import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ChangePassword({ email, onClose }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // ✅ 모달 상태 추가
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
    onClose?.(); // 모달 닫을 때 onClose 실행
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setError("비밀번호가 일치하지 않습니다.");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setModalMessage("비밀번호가 성공적으로 변경되었습니다.");
        setShowModal(true);
      } else {
        const msg = await res.text();
        setError("변경 실패: " + msg);
      }
    } catch (err) {
      console.error(err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <h5 className="text-center fw-bold mb-4">🔐 새 비밀번호 설정</h5>

      <Form onSubmit={handleSubmit}>
        <Form.Control
          type="password"
          placeholder="새 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2"
          required
        />
        <Form.Control
          type="password"
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mb-3"
          required
        />
        {error && <div className="text-danger mb-3">{error}</div>}

        <Button type="submit" variant="dark" className="w-100">
          비밀번호 변경
        </Button>
      </Form>

      {/* ✅ 모달 UI */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>알림</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangePassword;
