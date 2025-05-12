import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import "./Login.css"; 

function Login({ closeLogin, setIsLoggedIn }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    gender: "",
    birthday: "",
    remember: false,
  });

  const [repassword, setRepassword] = useState("");
  const [authKeySent, setAuthKeySent] = useState("");
  const [userInputKey, setUserInputKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [emailReadOnly, setEmailReadOnly] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!isCodeSent || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "repassword") setRepassword(value);
    else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // E-mail
  const sendEmailHandler = async () => {
    if (!formData.email) return alert("이메일을 입력하세요.");
    try {
      const res = await fetch("http://localhost:8080/api/users/email/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, type: "signup" }),
      });
      const data = await res.text();
      if (data === "duplicate") setEmailStatus("이미 존재하는 이메일입니다.");
      else {
        setAuthKeySent(data);
        setIsCodeSent(true);
        setTimeLeft(300);
        setEmailStatus("인증 메일이 전송되었습니다.");
      }
    } catch (err) {
      console.error(err);
      setEmailStatus("이메일 인증 실패");
    }
  };

  // E-mail verify
  const verifyAuthKeyHandler = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, authKey: userInputKey }),
      });
      if (res.ok) {
        alert("이메일 인증 완료!");
        setIsVerified(true);
        setEmailReadOnly(true);
        setEmailStatus("");
      } else {
        alert("인증 실패");
      }
    } catch (e) {
      console.error(e);
      alert("서버 오류");
    }
  };

  // Login/siginup success
  const submitHandler = async (e) => {
    e.preventDefault();
    const url = isSignup ? "http://localhost:8080/api/users" : "http://localhost:8080/api/users/login";

    if (isSignup) {
      if (!isVerified) return alert("이메일 인증 먼저 하세요.");
      if (formData.password !== repassword) return alert("비밀번호 불일치");
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? formData : {
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        alert(isSignup ? "회원가입 성공!" : `로그인 성공! 환영합니다, ${result.nickname}님`);
        if (!isSignup) {
          const token = result.token; // 백엔드가 내려주는 JSON 필드 이름 맞게 확인
          console.log(token);
          console.log(result);
          localStorage.setItem("token", token);
          setIsLoggedIn(true);    
          closeLogin?.();}
      } else {
        const err = await res.text();
        alert(`실패: ${err}`);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  // Google
  const GOOGLE_CLIENT_ID = "461258083904-or440dgo67641d00i882h65fcp22bqr1.apps.googleusercontent.com";
  const GOOGLE_REDIRECT_URL = "http://localhost:8080/api/users/login/google";

  const handleGoogleLogin = () => {
    const GoogleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URL)}`
      + `&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    window.location.href = GoogleAuthUrl;
  };
  
  // Kakao 
  //const REST_API_KEY = import.meta.env.VITE_KAKAO_CLIENT_ID;
  //const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const REST_API_KEY = "e6277124451eab83b9d7885e70191688";
  const REDIRECT_URI = "http://localhost:8080/api/users/login/kakao";

  console.log("🔑 REST_API_KEY =", REST_API_KEY);
  console.log("🔁 REDIRECT_URI =", REDIRECT_URI);
 
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  // Naver
  const NAVER_CLIENT_ID = "gE7Z05siQyzYs9sQZgem";
  const NAVER_REDIRECT_URL = "http://localhost:8080/api/users/login/naver";
  const handleNaverLogin = () => {
    const NaverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code`
      + `&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URL)}&state=RANDOM_STRING`;
    window.location.href = NaverAuthUrl;
  };

  return (
    <div className="loginModal">
      <div className="logo">
        <span style={{ color: "#333" }}>ON</span>
        <img src="/onda-favicon.png" alt="ONDA 로고"/>
        <span style={{ color: "#333" }}>DA</span>
      </div>

      <Form onSubmit={submitHandler}>
        <Form.Control type="email" name="email" placeholder="이메일" className="mb-3" value={formData.email} onChange={changeHandler} required readOnly={emailReadOnly} />

        {isSignup && !isVerified && (
          <>
            <Button onClick={sendEmailHandler} className="mb-2" size="sm">인증코드 요청</Button>
            {isCodeSent && (
              <>
                <Form.Control type="text" placeholder="인증코드 입력" value={userInputKey} onChange={(e) => setUserInputKey(e.target.value)} className="mb-2" />
                <Button onClick={verifyAuthKeyHandler} size="sm">인증하기</Button>
                <div className="text-danger mt-2">유효 시간: {formatTime(timeLeft)}</div>
              </>
            )}
            {emailStatus && <div className="text-danger mt-2">{emailStatus}</div>}
          </>
        )}

        <Form.Control type="password" name="password" placeholder="비밀번호" className="mb-3" value={formData.password} onChange={changeHandler} required />
        {isSignup && (
          <>
            <Form.Control type="password" name="repassword" placeholder="비밀번호 재입력" className="mb-3" value={repassword} onChange={changeHandler} required />
            <Form.Control type="text" name="nickname" placeholder="닉네임" className="mb-3" value={formData.nickname} onChange={changeHandler} required />
            <Form.Select name="gender" className="mb-3" value={formData.gender} onChange={changeHandler} required>
              <option value="">성별 선택</option>
              <option value="male">남자</option>
              <option value="female">여자</option>
            </Form.Select>
            <Form.Control type="date" name="birthday" className="mb-3" value={formData.birthday} onChange={changeHandler} required />
          </>
        )}

        <Button type="submit" variant="dark" className="w-100 mb-3">
          {isSignup ? "회원가입" : "로그인"}
        </Button>
      </Form>

      {!isSignup && (
        <div className="mb-4">
          <Button onClick={handleGoogleLogin} className="w-100 mb-3 d-flex align-items-center justify-content-center" variant="light">
            <FaGoogle className="me-2" /> 구글 계정으로 로그인
          </Button>
          <Button onClick={handleKakaoLogin} className="w-100 mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#FEE500", color: "#000", fontWeight: "bold" }}>
            <SiKakaotalk className="me-2" /> 카카오 계정으로 로그인
          </Button>
          <Button onClick={handleNaverLogin} className="w-100" style={{ backgroundColor: "#03C75A", color: "#fff", fontWeight: "bold" }}>
            <SiNaver className="me-2" /> 네이버 계정으로 로그인
          </Button>
        </div>
      )}

      <div style={{ fontSize: "0.9rem" }}>
        {isSignup ? (
          <>이미 계정이 있으신가요? <a href="#" className="fw-semibold" onClick={() => setIsSignup(false)}>로그인</a></>
        ) : (
          <>회원이 아니신가요? <a href="#" className="fw-semibold" onClick={() => setIsSignup(true)}>회원가입</a></>
        )}
      </div>
    </div>
  );
}

export default Login;
