import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Signup() {   // json 형식입니당.
  const [form, setForm] = useState({
    userId: "",
    email: "",
    password: "",
    nickname: "",
    gender: ""
  });

  const changeHandler = (e) => {    
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/login")
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
        <input type="text"name="userId" placeholder="아이디" value={form.userId} onChange={changeHandler} required/><br/><br/>
        <input type="text"name="email" placeholder="이메일" value={form.email} onChange={changeHandler} required/><br/><br/> 
        <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={changeHandler} required/><br/><br/>
        <input type="text" name="nickname" placeholder="닉네임" value={form.nickname} onChange={changeHandler} required/><br/><br/>
        <select name="gender" value={form.gender} onChange={changeHandler} required>
          <option value="">성별 선택</option>
          <option value="male">남자</option>
          <option value="female">여자</option>
        </select><br/><br/>
        
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
