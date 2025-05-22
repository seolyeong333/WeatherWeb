import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginSuccess() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true; 

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");  // 카카오용
    // const code = params.get("code");   // 구글&네이버용 - 백엔드에서 token으로 통합하기로 결정.
    // const state = params.get("state"); // 네이버용

    if (token) {
      localStorage.setItem("token", token);
    } else {
      alert("토큰 없음. 카카오 로그인 실패");
    }
    navigate("/"); 
  }, [navigate]);

  return null;
}
export default LoginSuccess;