import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function MainPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); // 이메일, 닉네임, auth 등
        setUser(decoded);
      } catch (error) {
        console.error("토큰 오류:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");   // 토큰 가져다 버려서 로그아웃 함.
    setUser(null);
    alert("로그아웃되었습니다.");
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>🌤️ 날씨 기반 추천 웹사이트</h1>

      {user ? (
        <div>
          <p><strong>{user.nickname}</strong>님, 환영합니다!</p>
          <p>권한: {user.auth}</p>
          <button onClick={logoutHandler}>로그아웃</button>
        </div>
      ) : (
        <div>
          <p>로그인이 필요합니다.</p>
          <button onClick={() => navigate("/login")}>로그인하기</button>
        </div>
      )}
    </div>
  );
}

export default MainPage;
