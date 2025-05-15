import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import "./SocialSignup.css";

function SocialSignup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const email = params.get("email");
  const provider = params.get("provider");
  const initialNickname = params.get("nickname");

  const [formData, setFormData] = useState({
    email,
    provider,
    password: "",
    nickname: initialNickname || "",
    gender: "",
    birthday: "",
  });

  const [repassword, setRepassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const changeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "repassword") {
      setRepassword(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    /*
    if (!formData.password || formData.password.length < 6) {
      return "비밀번호는 최소 6자 이상이어야 합니다.";
    }
      */
    if (formData.password !== repassword) {
      return "비밀번호가 일치하지 않습니다.";
    }
    if (!formData.nickname.trim()) return "닉네임을 입력하세요.";
    if (!formData.gender) return "성별을 선택하세요.";
    if (!formData.birthday) return "생일을 입력하세요.";
    return null;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return setErrorMessage(error);

    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const loginRes = await fetch("http://localhost:8080/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await loginRes.json();
        localStorage.setItem("token", data.token);
        navigate("/main");
      } else {
        const msg = await res.text();
        setErrorMessage(`회원가입 실패: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="loginModal">
      <div className="logo">
        <span style={{ color: "#333" }}>ON</span>
        <img src="/onda-favicon.png" alt="ONDA 로고" />
        <span style={{ color: "#333" }}>DA</span>
      </div>

      <form onSubmit={submitHandler}>
        <p className="text-muted">이메일: {email}</p>

        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={changeHandler}
          className="form-control mb-2"
          required
        />
        <input
          name="repassword"
          type="password"
          placeholder="비밀번호 확인"
          value={repassword}
          onChange={changeHandler}
          className="form-control mb-2"
          required
        />
        <input
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={changeHandler}
          className="form-control mb-2"
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={changeHandler}
          className="form-control mb-2"
          required
        >
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
        <input
          name="birthday"
          type="date"
          value={formData.birthday}
          onChange={changeHandler}
          className="form-control mb-3"
          required
        />

        {errorMessage && (
          <div className="text-danger mb-2">{errorMessage}</div>
        )}

        <button type="submit" className="btn btn-dark w-100">
          회원가입 완료
        </button>
      </form>
    </div>
  );
}

export default SocialSignup;
