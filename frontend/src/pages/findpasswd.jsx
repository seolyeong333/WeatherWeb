import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmailAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [authKeySent, setAuthKeySent] = useState(""); // 서버에서 받은 인증코드
  const [userInputKey, setUserInputKey] = useState(""); // 사용자가 입력하는 인증코드
  const [emailStatus, setEmailStatus] = useState(""); // 인증 상태 메시지


  // 이메일로 인증코드 요청
  const sendEmailHandler = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/email/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "reset" })
      });

      const data = await response.text(); // 서버가 문자열(userId, duplicate, none, fail 등)을 리턴하니까

      if (data === "fail") {
        setEmailStatus("메일 전송에 실패했습니다."); 
      } else if ( data === "notFound") {
        setEmailStatus("이메일이 존재하지 않습니다. 다시 확인해주세요.")
      }
       else {
        setAuthKeySent(data); // 인증코드 저장
        setEmailStatus("인증 메일을 보냈습니다. 이메일을 확인하세요.");
      }
    } catch (error) {
      console.error(error);
      setEmailStatus("서버 연결 실패");
    }
  };

  // 사용자가 입력한 인증코드 확인
  const verifyAuthKeyHandler = () => {
    if (authKeySent === "") {
      alert("먼저 이메일 인증코드를 요청하세요.");
      return;
    }

    if (authKeySent === userInputKey.trim()) {
      alert("인증 성공!");
      navigate("/changepasswd", { state: { email } });
    } else {
      alert("인증 실패. 올바른 인증코드를 입력하세요.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>비밀번호 찾기</h2>

      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={sendEmailHandler} style={{ width: "100%", marginBottom: "20px" }}>
        인증코드 요청
      </button>

      {authKeySent && (
        <>
          <input
            type="text"
            placeholder="인증코드 입력"
            value={userInputKey}
            onChange={(e) => setUserInputKey(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={verifyAuthKeyHandler} style={{ width: "100%" }}> 인증하기 </button>
          
        </>
      )}
      <button onClick={() => navigate("/login")}> 로그인 페이지 </button>
      {emailStatus && <p style={{ marginTop: "20px", color: "red" }}>{emailStatus}</p>}
    </div>
  );
}

export default EmailAuth;
