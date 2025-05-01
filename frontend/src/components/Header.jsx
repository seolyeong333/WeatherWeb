import { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="shadow-sm px-3">
        <Button variant="link" className="text-dark me-3" onClick={toggleMenu}>
          <FaBars size={20} />
        </Button>

        <Navbar.Brand href="#" className="fw-bold">🌦️ ONDA</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/">홈</Nav.Link>
            <Nav.Link href="#">오늘의 날씨</Nav.Link>
            <Nav.Link href="#">오늘의 장소</Nav.Link>
            <Nav.Link href="#">오늘의 코디</Nav.Link>
            <Nav.Link as={NavLink} to="/mypage">마이페이지</Nav.Link>
          </Nav>
          <Button variant="secondary">로그인</Button>
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
    </>
  );
}

export default Header;
