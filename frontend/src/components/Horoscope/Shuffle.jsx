import React, { useEffect } from "react";

function Shuffle({onComplete}) {
  // 셔플 완료 후 자동으로 다음 단계로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // 다음 단계로
    }, 1000); // 1초 셔플

    return () => clearTimeout(timer); // 언마운트 시 타이머 제거
  }, []);

  return (
    <div
      style={{
        color: "#fff",
        textShadow: "0 0 25px rgba(213, 183, 15, 0.6)",
        textAlign: "center",
        padding: "5rem 2rem",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>🔮 카드를 셔플 중입니다...</h2>
      <div className="spinner" />
    </div>
  );
}

export default Shuffle;
