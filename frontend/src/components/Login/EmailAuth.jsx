import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json"; // 로딩 애니메이션 경로

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EmailAuth({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [userInputKey, setUserInputKey] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태

  const showAlert = (msg) => {
    setModalMessage(msg);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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
    if (!email) return showAlert("이메일을 입력하세요.");
    try {
      setIsLoading(true); // ✅ 로딩 시작
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
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  const verifyAuthKeyHandler = async () => {
    try {
      if (!userInputKey.trim()) return showAlert("인증코드를 입력하세요.");
      if (timeLeft <= 0) {
        setEmailStatus("인증 시간이 만료되었습니다.");
        return;
      }

      setIsLoading(true); // ✅ 로딩 시작
      const res = await fetch(`${API_BASE_URL}/api/users/email/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, authKey: userInputKey.trim() }),
      });

      if (res.ok) {
        showAlert("인증 성공!");
        onSuccess?.(email);
      } else {
        const msg = await res.text();
        showAlert("인증 실패: " + msg);
      }
    } catch (err) {
      console.error(err);
      showAlert("서버 오류");
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
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

      {/* ✅ 로딩 애니메이션 */}
      {isLoading && (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(255,255,255,0.7)", zIndex: 9999
        }}>
          <div style={{ width: 150, marginBottom: "0.2rem" }}> {/* 간격 ↓ */}
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
          <div style={{ fontSize: "1rem", color: "#333", fontWeight: "500" }}>
            이메일을 전송중입니다...
          </div>
        </div>
      )}



    </>
  );
}

export default EmailAuth;
