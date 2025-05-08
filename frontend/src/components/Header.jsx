// 상단 네비게이션 바 + 왼쪽 사이드 메뉴 + 로그인 모달을 모두 포함한 Header 컴포넌트

// 필요한 라이브러리 및 컴포넌트 import
import { useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";  // 애니메이션 효과
import Login from "../pages/login";      // 로그인 모달 컴포넌트

function Header() {
  // 🔹 왼쪽 메뉴 열림 여부
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  // 🔹 로그인 모달 열림 여부
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <>
      {/* 상단 네비게이션 바 */}
      <Navbar bg="light" expand="md" className="shadow-sm px-3">
        {/* 좌측 햄버거 버튼 (사이드 메뉴 열기용) */}
        <Button variant="link" className="text-dark me-3" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>

        {/* 가운데 브랜드 로고 - ON + 로고 이미지 + DA */}
        <Navbar.Brand href="#" className="fw-bold">
          <div className="d-flex align-items-center" style={{ gap: "0.0rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 600, marginRight: "0.1rem" }}>ON</span>
            <img
              src="/onda-favicon.png"
              alt="ONDA 로고"
              style={{ height: "33px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "1.2rem", fontWeight: 600, marginLeft: "0.1rem" }}>DA</span>
          </div>
        </Navbar.Brand>

        {/* 모바일 토글 버튼 */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* 중간 네비게이션 메뉴 */}
          <Nav className="mx-auto">
            <Nav.Link href="/main">홈</Nav.Link>
            <Nav.Link href="#">오늘의 날씨</Nav.Link>
            <Nav.Link href="/today-place">오늘의 장소</Nav.Link>
            <Nav.Link href="#">오늘의 코디</Nav.Link>
            <Nav.Link href="/mypage">마이페이지</Nav.Link>
          </Nav>

          {/* 로그인 버튼 (우측) */}
          <Button variant="secondary" type="button" onClick={openLogin}>
            로그인
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <div className="rainbow-animated-bar"></div> {/* ✅ 요거 추가 */}
      
      {/* 🔹 왼쪽 사이드 메뉴 (오버레이 포함) */}
      {menuOpen && (
        <>
          {/* 화면 어둡게 처리 (오버레이) */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeMenu}
            style={{ zIndex: 999 }}
          ></div>

          {/* 사이드 메뉴 패널 */}
          <div 
            className="position-fixed top-0 start-0 bg-light shadow p-3"
            style={{ width: "220px", height: "100vh", zIndex: 1000 }}
          >
            <Nav className="flex-column">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Favorites</Nav.Link>
              <Nav.Link href="#">Review</Nav.Link>
              <Nav.Link href="#">Settings</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>
            </Nav>
          </div>
        </>
      )}

      {/* 🔹 로그인 모달 (오버레이 포함) */}
      {showLogin && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeLogin}
            style={{ zIndex: 1099 }}
          ></div>

          {/* 모달 창 */}
          <motion.div
            className="bg-white p-4 rounded-5 shadow-lg position-fixed top-50 start-50 translate-middle"
            style={{
              zIndex: 1100,
              width: "100%",
              maxWidth: "450px",
              padding: "1.8rem 2rem 1.5rem 2rem",  // 상/좌우/하 여백
              minHeight: "560px"  // 세로 공간 확보
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {/* 모달 닫기 버튼 (오른쪽 상단 X) */}
            <button onClick={closeLogin} className="btn-close float-end" aria-label="Close"></button>

            {/* 로그인 폼 렌더링 */}
            <Login closeLogin={closeLogin} />
          </motion.div>
        </>
      )}
    </>
  );
}

export default Header;
