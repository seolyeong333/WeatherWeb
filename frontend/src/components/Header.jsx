import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import Login from "./Login/login.jsx";
// 공통 JWT 유틸 import
import { isLoggedIn as checkLogin, getUserAuth } from "../api/jwt";
import { toast } from "react-toastify";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(checkLogin());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const isAdmin = getUserAuth() === "ADMIN"; // 🔹 권한 판단

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // 로그인 상태만 갱신하면 됨
    navigate("/main");
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="shadow-sm px-3">
        <Button variant="link" className="text-dark me-3" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>
        <button onClick={() => toast("🔔 테스트 알림입니다!")}>테스트 알림</button>
        <Navbar.Brand href="#" className="fw-bold">
          <div className="d-flex align-items-center">
            <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>ON</span>
            <img src="/onda-favicon.png" alt="ONDA 로고" style={{ height: "33px", margin: "0 5px" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>DA</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/main">홈</Nav.Link>
            <Nav.Link href="/today-weather">오늘의 날씨</Nav.Link>
            <Nav.Link href="/today-place">오늘의 장소</Nav.Link>
            <Nav.Link href="/today-look">오늘의 코디</Nav.Link>
            <Nav.Link href="/horoscope/tarot">오늘의 운세</Nav.Link>
            <Nav.Link href="/notice">공지사항</Nav.Link>
            {isLoggedIn && (
              <Nav.Link href={isAdmin ? "/admin" : "/mypage"}>
                {isAdmin ? "관리자페이지" : "마이페이지"}
              </Nav.Link>
            )}
          </Nav>

          {isLoggedIn ? (
            <Button variant="outline-danger" onClick={handleLogout}>
              로그아웃
            </Button>
          ) : (
            <Button variant="secondary" onClick={openLogin}>
              로그인
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>

      <div className="rainbow-animated-bar"></div>

      {menuOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeMenu}
            style={{ zIndex: 999 }}
          ></div>
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

      {showLogin && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeLogin}
            style={{ zIndex: 1099 }}
          ></div>
          <motion.div
            className="bg-white p-4 rounded-5 shadow-lg position-fixed top-50 start-50 translate-middle"
            style={{
              zIndex: 1100,
              width: "100%",
              maxWidth: "450px",
              padding: "1.8rem 2rem 1.5rem 2rem",
              minHeight: "560px"
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button onClick={closeLogin} className="btn-close float-end" aria-label="Close"></button>
            <Login closeLogin={closeLogin} setIsLoggedIn={setIsLoggedIn} />
          </motion.div>
        </>
      )}
    </>
  );
}

export default Header;
