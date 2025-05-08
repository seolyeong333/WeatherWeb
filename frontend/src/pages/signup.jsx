// ✅ Signup.jsx - 이메일 기반 + 생년월일 입력 추가
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
    nickname: "",
    gender: "",
    birthday: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://https://202f7e78-8052-42f1-8f54-7cbfd15d742f.mock.pstmn.io/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        alert("회원가입 실패 ㅠㅠ");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류 발생");
    }
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>회원가입</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={changeHandler}
          required
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={changeHandler}
          required
        /><br /><br />

        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={changeHandler}
          required
        /><br /><br />

        <select
          name="gender"
          value={formData.gender}
          onChange={changeHandler}
          required
        >
          <option value="">성별 선택</option>
          <option value="male">남자</option>
          <option value="female">여자</option>
        </select><br /><br />

        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={changeHandler}
          required
        /><br /><br />

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
