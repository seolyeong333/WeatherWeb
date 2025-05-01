// ✅ src/pages/MyPage.jsx
import { useState, useEffect, useContext } from "react";
import { Tab, Nav, Row, Col, Card, Button } from "react-bootstrap";
import Header from "../components/Header";
import { FaUser, FaCommentDots, FaExclamationCircle } from "react-icons/fa";
import { WeatherContext } from "../components/WeatherContext";
import "./MyPage.css";

function MyPage() {
  const [userInfo] = useState({
    nickname: "홍길동",
    email: "hong@example.com",
    joinedAt: "2024-12-15",
  });

  const {
    isRainy,
    isSnowy,
    isSunny,
    isCloudy,
    isThunder,
  } = useContext(WeatherContext);

  useEffect(() => {
    const container = document.getElementById("rain-overlay");
    if ((isRainy || isThunder) && container) {
      container.innerHTML = "";
      for (let i = 0; i < 80; i++) {
        const drop = document.createElement("div");
        drop.className = "raindrop";
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random().toFixed(2)}s`;
        drop.style.animationDuration = `${0.8 + Math.random()}s`;
        container.appendChild(drop);
      }
    } else if (container) {
      container.innerHTML = "";
    }
  }, [isRainy, isThunder]);

  useEffect(() => {
    const container = document.getElementById("snow-overlay");
    if (isSnowy && container) {
      container.innerHTML = "";
      for (let i = 0; i < 40; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.innerText = "❄";
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random().toFixed(2)}s`;
        flake.style.fontSize = `${8 + Math.random() * 8}px`;
        flake.style.opacity = "0.2";
        container.appendChild(flake);
      }
    } else if (container) {
      container.innerHTML = "";
    }
  }, [isSnowy]);

  return (
    <>
      {(isRainy || isThunder) && <div id="rain-overlay" className="rain-overlay" />}
      {isSnowy && <div id="snow-overlay" className="snow-overlay" />}
      {isSunny && <div className="weather-sunny-overlay" />}
      {isCloudy && <div className="weather-cloudy-overlay" />}
      {isThunder && <div className="weather-thunder-overlay" />}

      <Header />

      <div className={`main-content container mt-5 mb-5
        ${isCloudy || isRainy ? "cloudy-background" : ""}
        ${isSunny ? "sunny-background" : ""}
        ${isThunder ? "thunder-background" : ""}`}
      >
        <h2 className="fw-bold mb-4">👤 마이페이지</h2>
        <Tab.Container defaultActiveKey="info">
          <Row>
            <Col md={3} className="mb-3">
              <Nav variant="pills" className="flex-column shadow-sm rounded-3 p-3 bg-light">
                <Nav.Item>
                  <Nav.Link eventKey="info" className="d-flex align-items-center gap-2">
                    <FaUser /> 내 정보
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews" className="d-flex align-items-center gap-2">
                    <FaCommentDots /> 한줄평 관리
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reports" className="d-flex align-items-center gap-2">
                    <FaExclamationCircle /> 신고 내역
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>

            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="info">
                  <Card className="shadow-sm rounded-4">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">👤 회원 정보</h5>
                      <p><strong>닉네임:</strong> {userInfo.nickname}</p>
                      <p><strong>이메일:</strong> {userInfo.email}</p>
                      <p><strong>가입일:</strong> {userInfo.joinedAt}</p>
                      <div className="mt-3">
                        <Button variant="primary" className="me-2 px-4">정보 수정</Button>
                        <Button variant="outline-danger" className="px-4">회원 탈퇴</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="reviews">
                  <Card className="shadow-sm rounded-4">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">💬 내가 남긴 한줄평</h5>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span>🌳 서울숲 - “산책하기 좋아요”</span>
                          <Button size="sm" variant="outline-danger">삭제</Button>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <span>☕ 카페 마마스 - “샐러드 굿!”</span>
                          <Button size="sm" variant="outline-danger">삭제</Button>
                        </li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="reports">
                  <Card className="shadow-sm rounded-4">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">🚨 신고한 내역</h5>
                      <p>총 <strong>2건</strong>의 신고를 접수했습니다.</p>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">🏞️ 장소 “XX공원” - 정보 오류 신고 (2025-04-28)</li>
                        <li className="list-group-item">💬 한줄평 “욕설 포함” - 부적절 신고 (2025-04-15)</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
}

export default MyPage;
