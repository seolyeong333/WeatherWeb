import { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import Login from "../pages/Login";

function Header() {
  // 왼쪽 Menu-bar
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Login
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => {
    setShowLogin(true);
  };
  const closeLogin = () => {
    setShowLogin(false);
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="shadow-sm px-3">
        <Button variant="link" className="text-dark me-3" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>

        <Navbar.Brand href="#" className="fw-bold">🌦️ WeatherWeb</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="#">홈</Nav.Link>
            <Nav.Link href="#">오늘의 날씨</Nav.Link>
            <Nav.Link href="#">오늘의 장소</Nav.Link>
            <Nav.Link href="#">오늘의 코디</Nav.Link>
            <Nav.Link href="#">마이페이지</Nav.Link>
          </Nav>
          <Button variant="secondary" type="button" onClick={openLogin}>로그인</Button>
        </Navbar.Collapse>
      </Navbar>

      {/* ✅ 사이드 메뉴 + 오버레이 */}
      {menuOpen && (
        <>
          {/* ✅ 오버레이 클릭시 닫힘 */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeMenu}
            style={{ zIndex: 999 }}
          ></div>

          {/* ✅ 사이드바 */}
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

      {/* 로그인 모달 */}
      {showLogin && (
        <>
          {/* 오버레이 */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeLogin}
            style={{ zIndex: 1099 }}
          ></div>

          {/* 로그인 창 */}
          <motion.div
            className="bg-white p-4 rounded shadow"
            style={{ zIndex: 1100, width: "320px", position: "fixed", top: "100px", left: "50%", transform: "translateX(-50%)"}}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button onClick={closeLogin} className="btn-close float-end" aria-label="Close"></button>
            <Login 
              closeLogin={closeLogin} />
          </motion.div>
        </>
      )}
    </>
  );
}

export default Header;
