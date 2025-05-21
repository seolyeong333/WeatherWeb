import { useState } from "react";
import { Form, Button }
from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginForm({ closeLogin, setIsLoggedIn, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.warn("이메일과 비밀번호를 모두 입력해주세요."); 
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const result = await res.json();
        localStorage.setItem("token", result.token);
        setIsLoggedIn(true);
        toast.success(`로그인 성공! 환영합니다, ${result.nickname}님`); // ✅ 성공 토스트
        closeLogin?.(); // 성공 후 즉시 로그인 창 닫기
      } else {
        const errText = await res.text();
        toast.error(errText || "아이디 또는 비밀번호를 확인해주세요."); // ✅ 에러 토스트
      }
    } catch (err) {
      console.error("로그인 API 요청 오류:", err);
      toast.error("로그인 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."); // ✅ 에러 토스트
    }
  };

  const GOOGLE_CLIENT_ID = "461258083904-or440dgo67641d00i882h65fcp22bqr1.apps.googleusercontent.com";
  const GOOGLE_REDIRECT_URL = `${API_BASE_URL}/api/users/login/google`;
  const handleGoogleLogin = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URL)}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    window.location.href = url;
  };

  const KAKAO_REST_API_KEY = "e6277124451eab83b9d7885e70191688";
  const KAKAO_REDIRECT_URI = `${API_BASE_URL}/api/users/login/kakao`;
  const handleKakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}&response_type=code`;
    window.location.href = url;
  };

  const NAVER_CLIENT_ID = "gE7Z05siQyzYs9sQZgem";
  const NAVER_REDIRECT_URL = `${API_BASE_URL}/api/users/login/naver`;
  const handleNaverLogin = () => {
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URL)}&state=RANDOM_STRING`;
    window.location.href = url;
  };

  return (
    <>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="loginFormEmail">
            <Form.Label visuallyHidden>이메일</Form.Label>
            <Form.Control
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </Form.Group>
        <Form.Group className="mb-3" controlId="loginFormPassword">
            <Form.Label visuallyHidden>비밀번호</Form.Label>
            <Form.Control
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </Form.Group>
        <Button type="submit" variant="dark" className="w-100 mb-3">
          로그인
        </Button>
      </Form>

      <div className="mb-4 text-center">
        <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '0.75rem'}}></p>
        <Button onClick={handleGoogleLogin} className="w-100 mb-2 social-login-btn google-login-btn" variant="light">
          <FaGoogle className="me-2" /> 구글 계정으로 로그인
        </Button>
        <Button onClick={handleKakaoLogin} className="w-100 mb-2 social-login-btn kakao-login-btn" style={{ backgroundColor: "#FEE500", color: "#191919", borderColor: '#FEE500' }}>
          <SiKakaotalk className="me-2" /> 카카오 계정으로 로그인
        </Button>
        <Button onClick={handleNaverLogin} className="w-100 social-login-btn naver-login-btn" style={{ backgroundColor: "#03C75A", color: "#fff", borderColor: '#03C75A' }}>
          <SiNaver className="me-2" /> 네이버 계정으로 로그인
        </Button>
      </div>

      <div className="text-center" style={{ fontSize: "0.9rem" }}>
        <span className="me-2">회원이 아니신가요?</span>
        <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); }}>
          회원가입
        </a>
      </div>
      <div className="text-center mt-2" style={{ fontSize: "0.9rem" }}>
        <span className="me-2">비밀번호를 잊으셨나요?</span>
        <a href="#" onClick={(e) => { e.preventDefault(); setMode("findPassword"); }}>
          비밀번호 찾기
        </a>
      </div>
    </>
  );
}

export default LoginForm;