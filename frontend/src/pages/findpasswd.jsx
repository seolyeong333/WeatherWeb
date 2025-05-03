import { useState } from "react";

function FindPasswd() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  const handleFindPasswd = async (e) => {
    e.preventDefault();

    if (!email) {
      alert(" 이메일을 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error("비밀번호 찾기 오류:", error);
      setResult("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleFindPasswd}>
        <input type="email" name="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "10px" }}
        /><br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          인증번호 요청
        </button>
      </form>

      {result && (
        <p style={{ marginTop: "30px", fontWeight: "bold", color: "blue" }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default FindPasswd;
