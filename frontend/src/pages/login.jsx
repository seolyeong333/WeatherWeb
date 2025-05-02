import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

function Login({ closeLogin }) {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    remember: false
  });

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    alert("로그인 요청");
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
        boxSizing: "border-box"
      }}
    >
    <div
        className="d-flex justify-content-center align-items-center mb-3"
        style={{
            fontWeight: 600,
            fontSize: "1.5rem",        // ✅ 글자 키움
            gap: "0.0rem"              // ✅ 아이콘과 더 가깝게
        }}
        >
        <span style={{ color: "#333" }}>ON</span>
        <img
            src="/onda-favicon.png"
            alt="ONDA 로고"
            style={{ height: "52px", objectFit: "contain" }}
        />
        <span style={{ color: "#333" }}>DA</span>
    </div>


        {/* ✅ 구분감 추가 */}
        <div style={{ marginTop: "1rem" }} />

      <Form onSubmit={submitHandler}>
        <Form.Control
          type="text"
          name="userId"
          placeholder="아이디"
          className="mb-3"
          value={formData.userId}
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
            label={
              <span style={{ fontSize: "0.85rem" }}>로그인 유지하기</span>
            }
          />
          <div style={{ fontSize: "0.85rem" }}>
            <a href="#" className="text-muted text-decoration-none me-2">아이디 찾기</a>|
            <a href="#" className="text-muted text-decoration-none ms-2">비밀번호 찾기</a>
          </div>
        </div>
        

        <Button
          type="submit"
          variant="dark"
          className="w-100 mb-3"
        >
          로그인
        </Button>
      </Form>

      {/* ✅ 구분감 추가 */}
      <div style={{ marginTop: "2rem" }} />

      {/* 소셜 로그인 */}
      <div className="mb-4">
        <Button
          onClick={handleGoogleLogin}
          className="w-100 mb-3 d-flex align-items-center justify-content-center"
          variant="light"
        >
          <FaGoogle className="me-2" /> 구글 계정으로 로그인
        </Button>

        <Button
          onClick={handleKakaoLogin}
          className="w-100 mb-3 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#FEE500", color: "#000", fontWeight: "bold" }}
        >
          <SiKakaotalk className="me-2" /> 카카오 계정으로 로그인
        </Button>

        <Button
          onClick={handleNaverLogin}
          className="w-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#03C75A", color: "#fff", fontWeight: "bold" }}
        >
          <SiNaver className="me-2" /> 네이버 계정으로 로그인
        </Button>
      </div>

      <div style={{ fontSize: "0.9rem" }}>
        회원이 아니신가요?{" "}
        <a href="#" className="fw-semibold" style={{ color: "#5B8DEF" }}>회원가입</a>
      </div>
    </div>
  );
}

export default Login;
