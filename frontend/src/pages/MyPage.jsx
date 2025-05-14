// src/pages/MyPage.jsx
import { useState, useEffect, useContext } from "react";
import { Tab, Nav, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { WeatherContext } from "../components/WeatherContext";
import PasswordCheckModal from "../components/MyPage/PasswordCheckModal";
import ConfirmModal from "../components/MyPage/ConfirmModal";
import WeatherOverlay from "../components/MyPage/WeatherOverlay";
import UserInfoTab from "../components/MyPage/UserInfoTab";
import OpinionTab from "../components/MyPage/OpinionTab";
import ReportTab from "../components/MyPage/ReportTab";
import EditUserInfo from "../components/MyPage/EditUserInfo";
import AlarmTab from "../components/MyPage/AlarmTab";
import AlarmListTab from "../components/MyPage/AlarmListTab";
import { FaBell } from "react-icons/fa";
import { FaUser, FaCommentDots, FaExclamationCircle } from "react-icons/fa";
import "./MyPage.css";

function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mode, setMode] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users/info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
      const data = await res.json();
      setUserInfo(data);
    } catch (err) {
      console.error("유저 정보 요청 실패:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const deleteAccount = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userInfo.email, password: userInfo.password }),
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

  return (
    <>
      <WeatherOverlay />
      <Header />

      <div className="mypage-wrapper container mt-5 mb-5">
        <h2 className="fw-bold mb-4">👤 마이페이지</h2>

        <Row>
          <Col md={3} className="mb-3">
            <Nav
              variant="pills"
              className="flex-column shadow-sm rounded-3 p-3 bg-light"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <Nav.Item>
                <Nav.Link eventKey="info"><FaUser /> 내 정보</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="opinions"><FaCommentDots /> 한줄평 관리</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports"><FaExclamationCircle /> 신고 내역</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="alarms"><FaBell /> 알림 설정</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            {activeTab === "info" && (
              <UserInfoTab
                userInfo={userInfo}
                setMode={setMode}
                setShowModal={setShowModal}
              />
            )}
            {activeTab === "edit" && (
              <EditUserInfo
                userInfo={userInfo}
                setUserInfo={setUserInfo} // ✅ 상태 업데이트
                fetchUserInfo={fetchUserInfo} // ✅ 최신 정보 반영
                setShowEditComponent={() => setActiveTab("info")}
              />
            )}
            {activeTab === "opinions" && <OpinionTab userInfo={userInfo} />}
            {activeTab === "reports" && <ReportTab userInfo={userInfo} />}
            {activeTab === "alarms" &&   <>
              <AlarmTab userInfo={userInfo} />
              <AlarmListTab userId={userInfo?.userId} />
            </>
            }
          </Col>
        </Row>
      </div>

      <PasswordCheckModal
        show={showModal}
        onHide={() => setShowModal(false)}
        mode={mode}
        onSuccess={() => {
          setShowModal(false);
          if (mode === "edit") setActiveTab("edit");
          else if (mode === "delete") setShowConfirmModal(true);
        }}
        email={userInfo?.email}
      />

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