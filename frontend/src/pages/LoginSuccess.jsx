import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true; // ✅ 딱 한 번만 실행되게 제어

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");  // 카카오용
    // const code = params.get("code");   // 구글&네이버용 - 백엔드에서 token으로 통합하기로 결정.
    // const state = params.get("state"); // 네이버용

    if (token) {
      localStorage.setItem("token", token);
      alert("소셜 로그인 성공!");
      navigate("/main"); 
    } else {
      alert("토큰 없음. 카카오 로그인 실패");
    }
  }, [navigate]);

  return <div> <h2>로그인 처리 중입니다...</h2> </div>;
}
export default LoginSuccess;