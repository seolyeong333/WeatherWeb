import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EmailAuth({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [userInputKey, setUserInputKey] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!isCodeSent || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (s) => {
    const min = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const sendEmailHandler = async () => {
    if (!email) return alert("이메일을 입력하세요.");
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/email/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "reset" }),
      });
      const result = await response.text();
      if (result === "notFound") setEmailStatus("존재하지 않는 이메일입니다.");
      else if (result === "fail") setEmailStatus("메일 전송 실패");
      else {
        setIsCodeSent(true);
        setTimeLeft(300);
        setEmailStatus("인증 메일 전송 완료!");
      }
    } catch (err) {
      console.error(err);
      setEmailStatus("서버 오류");
    }
  };

  const verifyAuthKeyHandler = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, authKey: userInputKey.trim() }),
      });

      if (res.ok) {
        alert("인증 성공!");
        onSuccess?.(email);
      } else {
        const msg = await res.text();
        alert("인증 실패: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  return (
    <>
      <p className="text-center fw-bold mb-3">🔐 비밀번호 재설정을 위한 인증</p>
      <Form>
        <Form.Control
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2"
          required
        />
        <Button variant="dark" className="w-100 mb-3" onClick={sendEmailHandler}>
          인증코드 요청
        </Button>

        {isCodeSent && (
          <>
            <Form.Control
              type="text"
              placeholder="인증코드 입력"
              value={userInputKey}
              onChange={(e) => setUserInputKey(e.target.value)}
              className="mb-2"
              required
            />
            <Button variant="outline-dark" className="w-100 mb-2" onClick={verifyAuthKeyHandler}>
              인증하기
            </Button>
            <div className="text-danger mb-2 text-center">
              인증 유효 시간: <strong>{formatTime(timeLeft)}</strong>
            </div>
          </>
        )}

        {emailStatus && <div className="text-danger mb-3 text-center">{emailStatus}</div>}

        <Button variant="secondary" className="w-100" onClick={onClose}>
          ← 돌아가기
        </Button>
      </Form>
    </>
  );
}

export default EmailAuth;
