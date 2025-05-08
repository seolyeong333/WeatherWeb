import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

function Login({ closeLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    gender: "",
    birthday: "",
    remember: false,
  });

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const MOCK_BASE = "https://bf0e0938-d57a-4186-b3dd-dd00539ac6ed.mock.pstmn.io";


    // API endpoint 설정
    const url = isSignup
      ? `${MOCK_BASE}/api/users`
      : `${MOCK_BASE}/api/users/login`;

    // 요청 데이터 구성
    const payload = isSignup
      ? { ...formData, type: "signup" }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(isSignup ? "✅ 회원가입 성공" : "✅ 로그인 성공", result);
        alert(isSignup ? "회원가입 성공!" : `로그인 성공! 환영합니다, ${result.nickname}님`);

        if (!isSignup) {
          closeLogin?.(); // 로그인 성공 시 모달 닫기 등 처리
        }
      } else {
        const errorText = await response.text();
        console.error("❌ 요청 실패:", errorText);
        alert(isSignup ? "회원가입 실패" : "로그인 실패");
      }
    } catch (err) {
      console.error("🚨 서버 오류 발생:", err);
      alert("서버 오류가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
  };

  const handleKakaoLogin = () => {
    window.location.href = "https://kauth.kakao.com/oauth/authorize";
  };

  const handleNaverLogin = () => {
    window.location.href = "https://nid.naver.com/oauth2.0/authorize";
  };

  return (
    <div
      className="mx-auto px-3"
      style={{
        width: "100%",
        maxWidth: "450px",
        textAlign: "center",
        padding: "2.5rem 2rem",
        minHeight: "580px",
        boxSizing: "border-box",
      }}
    >
      <div className="d-flex justify-content-center align-items-center mb-3" style={{ fontWeight: 600, fontSize: "1.5rem" }}>
        <span style={{ color: "#333" }}>ON</span>
        <img src="/onda-favicon.png" alt="ONDA 로고" style={{ height: "52px" }} />
        <span style={{ color: "#333" }}>DA</span>
      </div>

      <Form onSubmit={submitHandler}>
        {!isSignup ? (
          <>
            <Form.Control
              type="email"
              name="email"
              placeholder="이메일"
              className="mb-3"
              value={formData.email}
              onChange={changeHandler}
              required
            />
            <Form.Control
              type="password"
              name="password"
              placeholder="비밀번호"
              className="mb-3"
              value={formData.password}
              onChange={changeHandler}
              required
            />
            <div className="d-flex justify-content-between align-items-center mb-4 px-1">
              <Form.Check
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={changeHandler}
                id="rememberCheck"
                label={<span style={{ fontSize: "0.85rem" }}>로그인 유지하기</span>}
              />
              <a href="#" className="text-muted text-decoration-none" style={{ fontSize: "0.85rem" }}>
                비밀번호 찾기
              </a>
            </div>
          </>
        ) : (
          <>
            <Form.Control
              type="email"
              name="email"
              placeholder="이메일"
              className="mb-3"
              value={formData.email}
              onChange={changeHandler}
              required
            />
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
              placeholder="생년월일"
              className="mb-3"
              value={formData.birthday}
              onChange={changeHandler}
              required
            />
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
          <Button onClick={handleNaverLogin} className="w-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#03C75A", color: "#fff", fontWeight: "bold" }}>
            <SiNaver className="me-2" /> 네이버 계정으로 로그인
          </Button>
        </div>
      )}

      <div style={{ fontSize: "0.9rem" }}>
        {isSignup ? (
          <>이미 계정이 있으신가요? <a href="#" className="fw-semibold" style={{ color: "#5B8DEF" }} onClick={() => setIsSignup(false)}>로그인</a></>
        ) : (
          <>회원이 아니신가요? <a href="#" className="fw-semibold" style={{ color: "#5B8DEF" }} onClick={() => setIsSignup(true)}>회원가입</a></>
        )}
      </div>
    </div>
  );
}

export default Login;
