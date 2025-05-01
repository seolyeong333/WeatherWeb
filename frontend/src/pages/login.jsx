import { useState } from "react";

export function Login() {
  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  });

  let changeHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  let submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://202f7e78-8052-42f1-8f54-7cbfd15d742f.mock.pstmn.io/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.text(); // 로그인 성공 시 토큰이나 사용자 정보 받을 수 있음
        console.log("로그인 성공:", data);
        alert("로그인 성공!");
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
      <input type="text"name="userId" placeholder="아이디" value={formData.userId} onChange={changeHandler} required/><br/><br/>
      <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={changeHandler} required/><br/><br/>
      <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
