import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SocialSignup({ email, provider, nickname, onClose }) {
  const [formData, setFormData] = useState({
    email,
    provider,
    password: "",
    nickname: nickname || "",
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
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    
      if (res.ok) {
        alert("회원가입이 완료되었습니다. 로그인 후 이용해주세요.");
        onClose?.(); 
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
          max="9999-12-31"
        />

        {errorMessage && (
          <div className="text-danger mb-2">{errorMessage}</div>
        )}

        <button type="submit" className="btn btn-dark w-100">
          회원가입 완료
        </button>
        <button type="button" className="btn btn-secondary w-100 mt-2" onClick={onClose}>
          닫기
        </button>
      </form>
    </div>
  );
}

export default SocialSignup;
