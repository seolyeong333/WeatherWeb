import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json"; // Lottie JSON 파일 경로
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SignupForm({ setMode, closeLogin }) {
  const [formData, setFormData] = useState({
    email: "", password: "", nickname: "", gender: "", birthday: "", provider: "local", remember: false,
  });
  const [repassword, setRepassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [userInputKey, setUserInputKey] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가

  const handleCloseModal = () => setShowModal(false);
  const showAlert = (msg) => {
    setModalMessage(msg);
    setShowModal(true);
  };

  useEffect(() => {
    if (!isCodeSent || timeLeft <= 0) {
      if (timeLeft <= 0 && isCodeSent) {
        setEmailStatus("인증 시간이 만료되었습니다. 다시 요청해주세요.");
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendEmailHandler = async () => {
    setEmailStatus("");
    if (!formData.email.trim()) return showAlert("이메일을 입력하세요.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return showAlert("올바른 이메일 형식이 아닙니다.");
    }
    try {
      setIsLoading(true); // ✅ 로딩 시작
      const res = await fetch(`${API_BASE_URL}/api/users/email/auth`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "signup" }),
      });
      const data = await res.text();
      if (data === "duplicate") {
        setEmailStatus("이미 존재하는 이메일입니다.");
      } else if (res.ok) {
        setIsCodeSent(true);
        setTimeLeft(300);
        setEmailStatus("인증코드가 전송되었습니다.");
        setEmailReadOnly(true);
      } else {
        setEmailStatus(data || "인증코드 전송에 실패했습니다.");
      }
    } catch (err) {
      console.error("이메일 인증 요청 오류:", err);
      setEmailStatus("인증코드 전송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  const verifyAuthKeyHandler = async () => {
    if (!userInputKey.trim()) return showAlert("인증코드를 입력하세요.");
    if (timeLeft <= 0) {
      setEmailStatus("인증 시간이 만료되었습니다. 인증 코드를 다시 요청해주세요.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/email/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, authKey: userInputKey.trim() }),
      });
      if (res.ok) {
        setIsVerified(true);
        setEmailReadOnly(true);
        setEmailStatus("");
        showAlert("이메일 인증 완료!");
      } else {
        const errorMsg = await res.text();
        showAlert(errorMsg || "인증에 실패했습니다. 코드를 확인해주세요.");
      }
    } catch (err) {
      console.error("인증 코드 확인 오류:", err);
      showAlert("인증 처리 중 오류가 발생했습니다.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isVerified) return showAlert("이메일 인증 먼저 진행해주세요.");
    if (formData.password !== repassword) return showAlert("비밀번호가 일치하지 않습니다.");

    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showAlert("회원가입 완료! 로그인 페이지로 이동합니다.");
        setMode("login");
      } else {
        let errorMessage = "회원가입 중 오류가 발생했습니다.";
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await res.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            } else {
              errorMessage = `이미 사용 중인 닉네임입니다.`;
            }
          } catch (jsonParseError) {
            console.error("JSON 파싱 에러:", jsonParseError);
            errorMessage = `서버 응답 처리 중 문제가 발생했습니다 (상태: ${res.status}).`;
          }
        } else {
          try {
            const errorText = await res.text();
            errorMessage = errorText.trim() ? errorText : `서버 오류 (상태 코드: ${res.status})`;
          } catch (textError) {
            errorMessage = `서버 응답을 읽는 중 문제가 발생했습니다 (상태 코드: ${res.status})`;
          }
        }
        showAlert(errorMessage);
      }
    } catch (networkError) {
      console.error("회원가입 API 요청 네트워크 오류:", networkError);
      showAlert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    }
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Form.Control
          type="email"
          name="email"
          placeholder="이메일"
          className="mb-3"
          value={formData.email}
          onChange={changeHandler}
          readOnly={emailReadOnly}
          required
        />

        {!isVerified && (
          <>
            <Button onClick={sendEmailHandler} className="mb-2" size="sm">인증코드 요청</Button>
            {isCodeSent && (
              <>
                <Form.Control
                  type="text"
                  placeholder="인증코드 입력"
                  value={userInputKey}
                  onChange={(e) => setUserInputKey(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={verifyAuthKeyHandler} size="sm">인증하기</Button>
                <div className="text-danger mt-2">유효 시간: {formatTime(timeLeft)}</div>
              </>
            )}
            {emailStatus && <div className="text-danger mt-2">{emailStatus}</div>}
          </>
        )}

        <Form.Control type="password" name="password" placeholder="비밀번호" className="mb-3" value={formData.password} onChange={changeHandler} required />
        <Form.Control type="password" name="repassword" placeholder="비밀번호 재입력" className="mb-3" value={repassword} onChange={(e) => setRepassword(e.target.value)} required />
        <Form.Control type="text" name="nickname" placeholder="닉네임" className="mb-3" value={formData.nickname} onChange={changeHandler} required />
        <Form.Select name="gender" className="mb-3" value={formData.gender} onChange={changeHandler} required>
          <option value="">성별 선택</option>
          <option value="male">남자</option>
          <option value="female">여자</option>
        </Form.Select>
        <Form.Control type="date" name="birthday" className="mb-3" value={formData.birthday} onChange={changeHandler} required max="9999-12-31" />

        <Button type="submit" variant="dark" className="w-100 mb-3" disabled={!isVerified}>회원가입</Button>
        <div className="text-center" style={{ fontSize: "0.9rem" }}>
          이미 계정이 있으신가요?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }} style={{ color: '#007bff', textDecoration: 'none' }}>로그인</a>
        </div>
      </Form>

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

      {/* ✅ Lottie 로딩 애니메이션 */}
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

export default SignupForm;
