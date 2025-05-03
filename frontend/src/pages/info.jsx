
import { useState } from "react";

function Info() {
  const [email, setEmail] = useState("");         // 입력한 이메일
  const [user, setUser] = useState(null);         // 조회된 사용자 정보
  const [error, setError] = useState(null);       // 에러 메시지

  const fetchUserInfo = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/users/info?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      const data = await response.json();
      setUser(data);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>회원 정보 조회</h2>

      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button onClick={fetchUserInfo} style={{ width: "100%" }}>
        조회하기
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {user && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <p><strong>회원번호:</strong> {user.userId}</p>
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>비밀번호:</strong> {user.password}</p>
          <p><strong>닉네임:</strong> {user.nickname}</p>
          <p><strong>성별:</strong> {user.gender}</p>
          <p><strong>생일:</strong> {user.birthday}</p>
          <p><strong>가입일:</strong> {user.createdAt}</p>
          <p><strong>권한:</strong> {user.auth}</p>
          <p><strong>로그인 방식:</strong> {user.provider}</p>
        </div>
      )}
    </div>
  );
}

export default Info;
