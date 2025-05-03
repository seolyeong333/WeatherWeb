import { useState } from "react";

function ChangePasswd() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [result, setResult] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if ( !email || !password || !confirmPassword) {
      alert("모든 항목을 입력하세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password: password })
      });

      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setResult("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "10px" }}
        /><br />
        <input
          type="password"
          placeholder="새 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "10px" }}
        /><br />
        <input
          type="password"
          placeholder="비밀번호 재입력"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "20px" }}
        /><br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          비밀번호 변경
        </button>
      </form>

      {result && (
        <p style={{ marginTop: "30px", fontWeight: "bold", color: "green" }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default ChangePasswd;
