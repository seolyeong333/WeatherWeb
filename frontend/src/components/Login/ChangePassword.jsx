import { useState } from "react";
import { Form, Button } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ChangePassword({ email, onClose }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

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
        alert("비밀번호가 성공적으로 변경되었습니다.");
        onClose?.();
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
    </>
  );
}

export default ChangePassword;
