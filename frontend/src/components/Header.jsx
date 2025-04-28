// src/components/Header.jsx
import { useState } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header style={{
      height: "60px",
      backgroundColor: "#D9D9D9",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      position: "sticky",
      top: 0,
      zIndex: 1000, // 항상 위에 보이게
    }}>
      {/* 왼쪽: 메뉴 버튼 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button 
          onClick={toggleMenu} 
          style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          &#9776; {/* 햄버거 메뉴 아이콘 (☰) */}
        </button>
      </div>

      {/* 가운데: 네비게이션 */}
      <nav style={{ display: "flex", gap: "50px", fontWeight: "bold" }}>
        <a href="#" style={{ textDecoration: "none", color: "black" }}>홈</a>
        <a href="#" style={{ textDecoration: "none", color: "black" }}>오늘의 날씨</a>
        <a href="#" style={{ textDecoration: "none", color: "black" }}>오늘의 장소</a>
        <a href="#" style={{ textDecoration: "none", color: "black" }}>마이페이지</a>
      </nav>

      {/* 오른쪽: 로그인 버튼 */}
      <div>
        <button style={{
          padding: "6px 12px",
          backgroundColor: "#8C8C8C",
          border: "none",
          borderRadius: "5px",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}>
          로그인
        </button>
      </div>

      {/* 햄버거 클릭 시 메뉴창 */}
      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "60px",
          left: "0",
          width: "200px",
          backgroundColor: "#F5F0FA",
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
        }}>
          <a href="#">Home</a>
          <a href="#">Favorites</a>
          <a href="#">Review</a>
          <a href="#">Mypage</a>
          <a href="#">Settings</a>
          <a href="#">About us</a>
        </div>
      )}
    </header>
  );
}

export default Header;
