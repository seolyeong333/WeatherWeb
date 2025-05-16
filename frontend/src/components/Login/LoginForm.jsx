// src/components/Login/LoginForm.jsx

import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

function LoginForm({ setIsSignup, closeLogin, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const result = await res.json();
        alert(`로그인 성공! 환영합니다, ${result.nickname}님`);
        localStorage.setItem("token", result.token);
        setIsLoggedIn(true);
        closeLogin?.();
      } else {
        const err = await res.text();
        alert(err);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=...`;
  };
  const handleKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?...`;
  };
  const handleNaverLogin = () => {
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?...`;
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Form.Control type="email" placeholder="이메일" className="mb-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Form.Control type="password" placeholder="비밀번호" className="mb-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="dark" className="w-100 mb-3">로그인</Button>
      </Form>

      <div className="mb-4">
        <Button onClick={handleGoogleLogin} className="w-100 mb-2" variant="light"><FaGoogle className="me-2" /> 구글 로그인</Button>
        <Button onClick={handleKakaoLogin} className="w-100 mb-2" style={{ backgroundColor: "#FEE500", color: "#000" }}><SiKakaotalk className="me-2" /> 카카오 로그인</Button>
        <Button onClick={handleNaverLogin} className="w-100" style={{ backgroundColor: "#03C75A", color: "#fff" }}><SiNaver className="me-2" /> 네이버 로그인</Button>
      </div>

      <div style={{ fontSize: "0.9rem" }}>
        회원이 아니신가요? <a href="#" onClick={() => setIsSignup(true)}>회원가입</a>
      </div>
    </>
  );
}

export default LoginForm;
