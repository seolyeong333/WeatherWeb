import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Link 추가 import
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import Login from "./Login/login.jsx";

// ✅ 공통 JWT 유틸 import
import { isLoggedIn as checkLogin, getUserAuth } from "../api/jwt";

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
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="shadow-sm px-3">
        <Button variant="link" className="text-dark me-3" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>

        {/* ▼▼▼ 로고/브랜드 클릭 시 홈으로 이동하도록 수정 ▼▼▼ */}
        <Navbar.Brand
          as={Link} // ✅ react-router-dom의 Link 컴포넌트로 동작하도록 설정
          to="/"      // ✅ 클릭 시 이동할 경로를 홈("/")으로 설정
          className="fw-bold"
          style={{ textDecoration: 'none', color: 'inherit' }} // 기본 링크 스타일 제거
        >
          <div className="d-flex align-items-center">
            <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>ON</span>
            <img src="/onda-favicon.png" alt="ONDA 로고" style={{ height: "33px", margin: "0 5px" }} />
            <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>DA</span>
          </div>
        </Navbar.Brand>
        {/* ▲▲▲ 로고/브랜드 수정 완료 ▲▲▲ */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {/* 다른 Nav.Link 들도 Link 컴포넌트로 변경하면 더 부드러운 SPA 네비게이션이 됩니다. */}
            {/* 예: <Nav.Link as={Link} to="/">오늘의 날씨</Nav.Link> */}
            <Nav.Link href="/">오늘의 날씨</Nav.Link>
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

      {/* ... (나머지 사이드 메뉴, 로그인 모달 코드는 동일) ... */}
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
              {/* 사이드 메뉴의 링크들도 필요하다면 react-router-dom의 Link로 변경할 수 있습니다. */}
              <Nav.Link as={Link} to="/" onClick={closeMenu}>Home</Nav.Link>
              <Nav.Link href="#" onClick={closeMenu}>Favorites</Nav.Link>
              <Nav.Link href="#" onClick={closeMenu}>Review</Nav.Link>
              <Nav.Link href="#" onClick={closeMenu}>Settings</Nav.Link>
              <Nav.Link href="#" onClick={closeMenu}>About</Nav.Link>
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