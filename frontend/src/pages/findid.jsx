import { useState } from "react";

function FindId() {
  const [email, setEmail] = useState("");

  const handleFindId = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/findId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email})
        
      });

      const data = await response.text();
      alert(`찾은 아이디: ${data}`);
    } catch (error) {
      console.error("ID 찾기 실패:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>아이디 찾기</h2>
      <form onSubmit={handleFindId}>
        <input
          type="email"
          name="email"
          placeholder="가입한 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "20px" }}
        /><br />
        <button type="submit" style={{ padding: "10px 20px" }}>아이디 찾기</button>
      </form>
    </div>
  );
}

export default FindId;
