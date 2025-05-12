// src/pages/TodayTarot.jsx
import React from "react";
import Header from "../components/Header";

function TodayTarot() {
  return (
    <div>
      <Header />

      <div style={{ display: "flex", height: "calc(100vh - 70px)", backgroundColor: "#f5f7fa" }}>
        {/* 좌측 메뉴바 */}
        <aside
          style={{
            width: "200px",
            backgroundColor: "#eee",
            padding: "1.5rem 1rem",
            boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "1rem" }}>
              <a href="/today-look" style={{ textDecoration: "none", color: "#333" }}>
                오늘의 코디
              </a>
            </li>
            <li>
              <a href="/today-tarot" style={{ textDecoration: "none", color: "#333" }}>
                오늘의 운세
              </a>
            </li>
          </ul>
        </aside>

        {/* 본문 */}
        <main style={{ flex: 1, padding: "2rem", textAlign: "center" }}>
          <h2 style={{ marginBottom: "2rem" }}>오늘 당신의 운세 및 색상을 확인하세요</h2>

          {/* 카드 3개 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              marginBottom: "2.5rem",
            }}
          >
            <img
              src="/images/tarot1.png"
              alt="카드1"
              style={{ width: "120px", height: "180px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}
            />
            <img
              src="/images/tarot2.png"
              alt="카드2"
              style={{ width: "120px", height: "180px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}
            />
            <img
              src="/images/tarot3.png"
              alt="카드3"
              style={{ width: "120px", height: "180px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}
            />
          </div>

          {/* Start 버튼 */}
          <button
            style={{
              padding: "0.6rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#5B8DEF",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Start
          </button>
        </main>
      </div>
    </div>
  );
}

export default TodayTarot;
