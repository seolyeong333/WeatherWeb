import { useState, useEffect, useContext } from "react";
import { Tab, Nav, Row, Col, Card, Button } from "react-bootstrap";
import Header from "../components/Header";
import { FaUser, FaCommentDots, FaExclamationCircle } from "react-icons/fa";
import { WeatherContext } from "../components/WeatherContext";
import PasswordCheckModal from "../components/PasswordCheckModal";
import ConfirmModal from "../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mode, setMode] = useState("");
  const navigate = useNavigate();

  const {
    isRainy,
    isSnowy,
    isSunny,
    isCloudy,
    isThunder,
  } = useContext(WeatherContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/users/info", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("유저 정보 요청 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userInfo.email,
          password: userInfo.password, // 프론트에서 비밀번호 받은 후 이 필드에 담아야 함
        }),
      });

      if (!res.ok) throw new Error("탈퇴 실패");

      localStorage.removeItem("token");
      alert("탈퇴가 완료되었습니다.");
      navigate("/main");
    } catch (err) {
      console.error("탈퇴 실패:", err);
      alert("탈퇴 중 오류가 발생했습니다.");
    }
  };

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

      <div className={`mypage-wrapper container mt-5 mb-5
        ${isCloudy || isRainy ? "cloudy-background" : ""}
        ${isSunny ? "sunny-background" : ""}
        ${isThunder ? "thunder-background" : ""}`}>
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
                  <Card className="mypage-card">
                    <Card.Body>
                      <h5 className="fw-semibold mb-3">👤 회원 정보</h5>
                      {userInfo ? (
                        <>
                          <p><strong>닉네임:</strong> {userInfo.nickname}</p>
                          <p><strong>이메일:</strong> {userInfo.email}</p>
                          <p><strong>성별:</strong> {userInfo.gender}</p>
                          <p><strong>생일:</strong> {userInfo.birthday}</p>
                          <p><strong>가입일:</strong> {userInfo.createdAt?.substring(0, 10)}</p>
                        </>
                      ) : (
                        <p>회원 정보를 불러오는 중입니다...</p>
                      )}
                      <div className="mt-3">
                        <Button
                          variant="primary"
                          className="me-2 px-4"
                          onClick={() => {
                            setMode("edit");
                            setShowModal(true);
                          }}
                        >
                          정보 수정
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="px-4"
                          onClick={() => {
                            setMode("delete");
                            setShowModal(true);
                          }}
                        >
                          회원 탈퇴
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="reviews">
                  <Card className="mypage-card">
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
                  <Card className="mypage-card">
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

      {/* 비밀번호 확인 모달 */}
      <PasswordCheckModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={mode}
        onSuccess={() => {
          setShowModal(false);
          if (mode === "edit") navigate("/edit");
          else if (mode === "delete") setShowConfirmModal(true);
        }}
        email={userInfo?.email}
      />

      {/* 정말 탈퇴할지 확인 모달 */}
      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          deleteAccount();
        }}
        message="정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      />
    </>
  );
}

export default MyPage;
