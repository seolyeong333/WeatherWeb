// src/components/MyPage/ChangePasswordTab.jsx
import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

function ChangePasswordTab({ userInfo, onSuccess, setShowEditComponent }) {
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (newPw !== confirmPw) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userInfo.email, password: newPw }),
      });

      if (res.ok) {
        setSuccess("비밀번호 변경 완료!");
        setError("");
        setNewPw(""); setConfirmPw("");
        onSuccess?.();
        setShowEditComponent();
      } else {
        const msg = await res.text();
        setError(msg || "비밀번호 변경 실패");
        setSuccess("");
      }
    } catch (err) {
      setError("서버 오류 발생");
    }
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">🔐 비밀번호 변경</h5>

        <Form.Group className="mb-3">
          <Form.Label>새 비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="새 비밀번호 입력"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>새 비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="다시 입력"
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Button onClick={handleSubmit} variant="primary">비밀번호 변경</Button>
      </Card.Body>
    </Card>
  );
}

export default ChangePasswordTab;
