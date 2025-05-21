import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
import Login from "./Login/login.jsx";
import "../styles/Header.css";
// 공통 JWT 유틸 import
import { isLoggedIn as checkLogin, getUserAuth, getUserNickname } from "../api/jwt";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(checkLogin());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [nickname, setNickname] = useState(getUserNickname());

  const isAdmin = getUserAuth() === "ADMIN";

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);
  
  const openLoginModal = () => { // 이름 변경으로 명확화 (기존 openLogin과 동일 기능)
    setShowLogin(true);
    closeMenu(); // 로그인 모달 열 때 사이드바는 닫기
  };
  const closeLoginModal = () => { // 이름 변경으로 명확화 (기존 closeLogin과 동일 기능)
    setShowLogin(false);
  };

  const handleLogoutAndCloseMenu = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setNickname(null); 
    navigate("/"); // 로그아웃 후 홈으로 이동
    closeMenu(); // 사이드바 닫기
  };

  return (
    <>
      <Navbar bg="white" expand="md" className="shadow-sm px-3 site-header">
        <Button variant="link" className="text-dark me-3 hamburger-button" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>

        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold logo-brand"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="d-flex align-items-center">
            <span className="logo-text" style={{ fontSize: "1.2rem" }}>ON</span>
            <img src="/onda-favicon.png" alt="ONDA 로고" style={{ height: "33px", margin: "0 5px" }} />
            <span className="logo-text" style={{ fontSize: "1.2rem" }}>DA</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="main-nav-link">오늘의 날씨</Nav.Link>
            <Nav.Link as={Link} to="/today-place" className="main-nav-link">오늘의 장소</Nav.Link>
            <Nav.Link as={Link} to="/today-look" className="main-nav-link">오늘의 코디</Nav.Link>
            <Nav.Link as={Link} to="/horoscope/tarot" className="main-nav-link">오늘의 운세</Nav.Link>
            <Nav.Link as={Link} to="/notice" className="main-nav-link">공지사항</Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={Link} to={isAdmin ? "/admin" : "/mypage"} className="main-nav-link">
                {isAdmin ? "관리자페이지" : "마이페이지"}
              </Nav.Link>
            )}
          </Nav>

          {isLoggedIn ? (
            <>
             <span className="me-3 fw-semibold text-dark">{nickname}</span>
             <Button variant="outline-secondary" size="sm" className="header-action-button" onClick={handleLogoutAndCloseMenu}>
              로그아웃
            </Button>
            </>

          ) : (
            <Button variant="outline-primary" size="sm" className="header-action-button" onClick={openLoginModal}>
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
            onClick={closeMenu} // 뒷배경 클릭 시 사이드바 닫기
            style={{ zIndex: 999 }}
          ></div>
          <div
            className="position-fixed top-0 start-0 bg-white shadow p-3 sidebar-menu"
            style={{ width: "220px", height: "100vh", zIndex: 1000 }}
          >
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="sidebar-nav-link" onClick={closeMenu}>
                홈
              </Nav.Link>

              {isLoggedIn ? (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/mypage" 
                    state={{ activeTab: "bookmark" }} 
                    className="sidebar-nav-link" 
                    onClick={closeMenu}
                  >
                    내 북마크
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/mypage" 
                    state={{ activeTab: "tarot" }}    
                    className="sidebar-nav-link" 
                    onClick={closeMenu}
                  >
                    내 타로 확인
                  </Nav.Link>
                  <Nav.Link
                    className="sidebar-nav-link"
                    onClick={handleLogoutAndCloseMenu}
                    style={{ cursor: 'pointer' }}
                  >
                    로그아웃
                  </Nav.Link>
                </>
              ) : (
                // 로그아웃 상태일 때의 사이드바 메뉴
                <>
                  <Nav.Link 
                    className="sidebar-nav-link" 
                    onClick={openLoginModal}
                    style={{ cursor: 'pointer' }} // 클릭 가능하도록 스타일 추가
                  >
                    로그인
                  </Nav.Link>
                </>
              )}
            </Nav>
          </div>
        </>
      )}

      {showLogin && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={closeLoginModal}
            style={{ zIndex: 1051 }}
          ></div>
          <motion.div
            className="bg-white p-4 rounded-5 shadow-lg position-fixed top-50 start-50 translate-middle login-modal-motion"
            style={{
              zIndex: 1052,
              width: "100%",
              maxWidth: "450px",
              padding: "1.8rem 2rem 1.5rem 2rem",
              minHeight: "560px"
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button onClick={closeLoginModal} className="btn-close float-end" aria-label="Close"></button>
            <Login closeLogin={closeLoginModal} setIsLoggedIn={setIsLoggedIn} />
          </motion.div>
        </>
      )}
    </>
  );
}

export default Header;