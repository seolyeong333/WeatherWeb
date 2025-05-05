import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    gender: "",
    birthday: ""
  });

  const [authKeySent, setAuthKeySent] = useState("");
  const [userInputKey, setUserInputKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [emailReadOnly, setEmailReadOnly] = useState(false);  

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmailHandler = async () => {
    if (!form.email) {
      alert("이메일을 입력하세요.");
      return;
    }

  

    try {
      const response = await fetch("http://localhost:8080/api/users/email/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "signup" })
      });

      const data = await response.text();

      if (data === "fail") {
        setEmailStatus("메일 전송 실패");
      } else if (data === "duplicate"){
        setEmailStatus("이미 존재하는 이메일입니다.");
      }else {
        setAuthKeySent(data);
        setEmailStatus("인증 메일을 보냈습니다. 이메일을 확인하세요.");
      }
    } catch (error) {
      console.error(error);
      setEmailStatus("서버 연결 실패");
    }
  };

  const verifyAuthKeyHandler = () => {
    if (authKeySent === "") {
      alert("먼저 이메일 인증코드를 요청하세요.");
      return;
    }

    if (authKeySent === userInputKey.trim()) {
      alert("인증 성공!");
      setEmailStatus("");
      setIsVerified(true);
      setEmailReadOnly(true);
    } else {
      alert("인증 실패. 올바른 인증코드를 입력하세요.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("이메일 인증을 먼저 완료해주세요.");
      return;
    }

    if (form.password !== form.repassword){
      alert("비밀번호가 다릅니다. 다시 확인해주세요.")
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/login");
      } else {
        const errorMsg = await response.text(); 
        alert(errorMsg); 
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류 발생");
    }
  };

  return (
    <div style={{ margin: "100px auto", textAlign: "center", maxWidth: "500px" }}>
      <h2>회원가입</h2>
      <form onSubmit={submitHandler}>
        <input type="email" name="email" placeholder="이메일" value={form.email} onChange={changeHandler} required readOnly={emailReadOnly}/><br /><br />
        { !isVerified && (  // 이거 하면 인증 하면 버튼 쇼로롱 사라짐
          <>        
            <button type="button" onClick={sendEmailHandler}>인증코드 요청</button><br /><br />
          </>
        
        )}
        {authKeySent && !isVerified && ( // 인증 버튼 누르면 쇼로록 생겼다가 인증 하면 버튼 쇼로롱 사라짐
          <>
            <input type="text" placeholder="인증코드 입력" value={userInputKey} onChange={(e) => setUserInputKey(e.target.value)} />
            <button type="button" onClick={verifyAuthKeyHandler}>인증하기</button><br /><br />
          </>
        )}

        <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={changeHandler} required /><br /><br />
        <input type="password" name="repassword" placeholder="재비밀번호" value={form.repassword} onChange={changeHandler} required /><br /><br /> 
        <input type="text" name="nickname" placeholder="닉네임" value={form.nickname} onChange={changeHandler} required /><br /><br />

        <select name="gender" value={form.gender} onChange={changeHandler} required>
          <option value="">성별 선택</option>
          <option value="male">남자</option>
          <option value="female">여자</option>
        </select><br /><br />

        <input type="date" name="birthday" value={form.birthday} onChange={changeHandler} required /><br /><br />

        <button type="submit">회원가입</button>
        <button onClick={() => navigate("/login")}> 로그인 페이지 </button>
      </form>

      {emailStatus && <p style={{ color: "red" }}>{emailStatus}</p>}
    </div>
  );
}

export default Signup;
