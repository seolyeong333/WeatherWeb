import { useState } from "react";

function EmailAuth() {
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
      const response = await fetch(`http://localhost:8080/api/auth/sendmail?email=${encodeURIComponent(email)}`, {
        method: "POST"
      });

      const data = await response.text(); // 서버가 문자열(userId, duplicate, none, fail 등)을 리턴하니까

      if (data === "duplicate") {
        setEmailStatus("이미 가입된 이메일입니다.");
      } else if (data === "none") {
        setEmailStatus("등록되지 않은 이메일입니다.");
      } else if (data === "fail") {
        setEmailStatus("메일 전송 실패");
      } else {
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
      alert("✅ 인증 성공!");
    } else {
      alert("❌ 인증 실패. 올바른 인증코드를 입력하세요.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>이메일 인증</h2>

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
          <button onClick={verifyAuthKeyHandler} style={{ width: "100%" }}>
            인증하기
          </button>
        </>
      )}

      {emailStatus && <p style={{ marginTop: "20px", color: "red" }}>{emailStatus}</p>}
    </div>
  );
}

export default EmailAuth;
