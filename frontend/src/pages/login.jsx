import { useState } from "react";
import { useNavigate } from "react-router-dom"

export function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userId: "",
    password: ""
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
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        const data = await response.json(); // JSON으로 받는다고 가정 (token 포함)
        const token = data.token; // 백엔드가 내려주는 JSON 필드 이름 맞게 확인
        console.log(token);
        console.log(data);
        localStorage.setItem("token", token);
        alert("로그인 성공!");
        navigate("/mainpage");
      } else {
        alert("로그인 실패 ㅠㅠ");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류 발생");
    }
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>로그인</h2>
      <form onSubmit={submitHandler}>
      <input type="email"name="email" placeholder="이메일" value={form.email} onChange={changeHandler} required/><br/><br/>
      <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={changeHandler} required/><br/><br/>
      <button type="submit">로그인</button>
      <button onClick={() => navigate("/findpasswd")}> 비밀번호 찾기 </button>
      <button onClick={() => navigate("/signup")}> 회원가입 </button>
      </form>
    </div>
  );
}

export default Login;
