import { useState } from "react";

function DeleteUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    const confirmDelete = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.text();
      setResult(data);
    } catch (error) {
      console.error("회원 삭제 오류:", error);
      setResult("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ margin: "100px", textAlign: "center" }}>
      <h2>회원 탈퇴</h2>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "10px" }}
        /><br />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", maxWidth: "300px", padding: "10px", marginBottom: "20px" }}
        /><br />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "crimson", color: "white" }}>
          탈퇴하기
        </button>
      </form>

      {result && (
        <p style={{ marginTop: "30px", fontWeight: "bold", color: "red" }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default DeleteUser;
