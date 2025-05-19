// src/components/Login/LoginForm.jsx
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginForm({ closeLogin, setIsLoggedIn, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
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

  // ✅ Google 로그인
  const GOOGLE_CLIENT_ID = "461258083904-or440dgo67641d00i882h65fcp22bqr1.apps.googleusercontent.com";
  const GOOGLE_REDIRECT_URL = `${API_BASE_URL}/api/users/login/google`;
  const handleGoogleLogin = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URL)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    window.location.href = url;
  };

  // ✅ Kakao 로그인
  const KAKAO_REST_API_KEY = "e6277124451eab83b9d7885e70191688";
  const KAKAO_REDIRECT_URI = `${API_BASE_URL}/api/users/login/kakao`;
  const handleKakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code`;
    window.location.href = url;
  };

  // ✅ Naver 로그인
  const NAVER_CLIENT_ID = "gE7Z05siQyzYs9sQZgem";
  const NAVER_REDIRECT_URL = `${API_BASE_URL}/api/users/login/naver`;
  const handleNaverLogin = () => {
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URL)}&state=RANDOM_STRING`;
    window.location.href = url;
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Form.Control
          type="email"
          placeholder="이메일"
          className="mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Form.Control
          type="password"
          placeholder="비밀번호"
          className="mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="dark" className="w-100 mb-3">
          로그인
        </Button>
      </Form>

      <div className="mb-4">
        <Button onClick={handleGoogleLogin} className="w-100 mb-2" variant="light">
          <FaGoogle className="me-2" /> 구글 계정으로 로그인
        </Button>
        <Button onClick={handleKakaoLogin} className="w-100 mb-2" style={{ backgroundColor: "#FEE500", color: "#000" }}>
          <SiKakaotalk className="me-2" /> 카카오 계정으로 로그인
        </Button>
        <Button onClick={handleNaverLogin} className="w-100" style={{ backgroundColor: "#03C75A", color: "#fff" }}>
          <SiNaver className="me-2" /> 네이버 계정으로 로그인
        </Button>
      </div>

      <div style={{ fontSize: "0.9rem" }}>
        회원이 아니신가요?{" "}
        <a href="#" onClick={() => setMode("signup")}>
          회원가입
        </a>
      </div>
      <div style={{ fontSize: "0.9rem" }}>
        비밀번호를 잊으셨나요?{" "}
        <a href="#" onClick={() => setMode("findPassword")}>
          비밀번호 찾기
        </a>
      </div>
    </>
  );
}

export default LoginForm;
