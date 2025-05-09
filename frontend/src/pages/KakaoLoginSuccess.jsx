import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function KakaoLoginSuccess() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true; // ✅ 딱 한 번만 실행되게 제어

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
      alert("카카오 로그인 성공!");
      navigate("/main"); // 메인 페이지 등으로 이동
    } else {
      alert("토큰 없음. 로그인 실패");
    }
  }, [navigate]);

  return <div> <h2>로그인 처리 중입니다...</h2> </div>;
}
export default KakaoLoginSuccess;