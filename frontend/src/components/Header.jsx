import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import Login from "./Login/login.jsx";

// ✅ JWT 디코딩 함수 (Base64 디코딩)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 🔹 로그인 시 JWT에서 관리자 여부 판단
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded?.auth === "ADMIN") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [isLoggedIn]);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/main");
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="shadow-sm px-3">
        <Button variant="link" className="text-dark me-3" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>

        <Navbar.Brand href="#" className="fw-bold">
          <div className="d-flex align-items-center" style={{ gap: "0.0rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 600, marginRight: "0.1rem" }}>ON</span>
            <img src="/onda-favicon.png" alt="ONDA 로고" style={{ height: "33px", objectFit: "contain" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 600, marginLeft: "0.1rem" }}>DA</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/main">홈</Nav.Link>
            <Nav.Link href="/today-weather">오늘의 날씨</Nav.Link>
            <Nav.Link href="/today-place">오늘의 장소</Nav.Link>
            <Nav.Link href="/today-look">오늘의 코디</Nav.Link>
            <Nav.Link href="/today-tarot">오늘의 운세</Nav.Link>
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
