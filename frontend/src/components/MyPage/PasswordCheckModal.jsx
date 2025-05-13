import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function PasswordCheckModal({ show, onHide, mode, onSuccess,email }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCheck = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users/check-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          password: password }),
      });

      if (res.ok) {
        setPassword("");
        setError("");
        onSuccess(); // 성공 시 콜백 실행 (edit 이동 또는 탈퇴 확인)
      } else {
        const err = await res.text();
        setError(err || "비밀번호가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error("비밀번호 확인 실패:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "edit" ? "비밀번호 확인" : "회원 탈퇴 전 확인"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>비밀번호를 입력해주세요</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleCheck}>확인</Button>
        <Button variant="secondary" onClick={handleClose}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PasswordCheckModal;
