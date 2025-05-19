// src/components/Login/SignupForm.jsx
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
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

  useEffect(() => {
    if (!isCodeSent || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendEmailHandler = async () => {
    if (!formData.email) return alert("이메일을 입력하세요.");
    const res = await fetch(`${API_BASE_URL}/api/users/email/auth`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, type: "signup" }),
    });
    const data = await res.text();
    if (data === "duplicate") {
      setEmailStatus("이미 존재하는 이메일입니다.");
    } else {
      setIsCodeSent(true); setTimeLeft(300);
      setEmailStatus("인증코드가 전송되었습니다.");
    }
  };

  const verifyAuthKeyHandler = async () => {
    const res = await fetch(`${API_BASE_URL}/api/users/email/verify`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, authKey: userInputKey }),
    });
    if (res.ok) {
      setIsVerified(true);
      setEmailReadOnly(true);
      setEmailStatus("");
      alert("이메일 인증 완료!");
    } else {
      alert("인증 실패");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isVerified) return alert("이메일 인증 먼저 진행해주세요.");
    if (formData.password !== repassword) return alert("비밀번호 불일치");
    const res = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("회원가입 완료!");
      setMode("login"); // 🔁 로그인 모드로 전환
    } else {
      alert(await res.text());
    }
  };

  return (
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

      <Form.Control
        type="password"
        name="password"
        placeholder="비밀번호"
        className="mb-3"
        value={formData.password}
        onChange={changeHandler}
        required
      />
      <Form.Control
        type="password"
        name="repassword"
        placeholder="비밀번호 재입력"
        className="mb-3"
        value={repassword}
        onChange={(e) => setRepassword(e.target.value)}
        required
      />
      <Form.Control
        type="text"
        name="nickname"
        placeholder="닉네임"
        className="mb-3"
        value={formData.nickname}
        onChange={changeHandler}
        required
      />
      <Form.Select
        name="gender"
        className="mb-3"
        value={formData.gender}
        onChange={changeHandler}
        required
      >
        <option value="">성별 선택</option>
        <option value="male">남자</option>
        <option value="female">여자</option>
      </Form.Select>
      <Form.Control
        type="date"
        name="birthday"
        className="mb-3"
        value={formData.birthday}
        onChange={changeHandler}
        required
        max="9999-12-31"
      />

      <Button type="submit" variant="dark" className="w-100 mb-3">회원가입</Button>
      <div style={{ fontSize: "0.9rem" }}>
        이미 계정이 있으신가요?{" "}
        <a href="#" onClick={() => setMode("login")}>로그인</a>
      </div>
    </Form>
  );
}

export default SignupForm;
