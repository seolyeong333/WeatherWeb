// src/pages/MyPage.jsx
import { useState, useEffect } from "react";
import { Nav, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import PasswordCheckModal from "../components/MyPage/PasswordCheckModal";
import ConfirmModal from "../components/MyPage/ConfirmModal";
import WeatherOverlay from "../components/MyPage/WeatherOverlay";
import UserInfoTab from "../components/MyPage/UserInfoTab";
import ChangePasswordTab from "../components/MyPage/ChangePasswordTab";
import TodayTarotResultTab from "../components/MyPage/TodayTarotResultTab";
import OpinionTab from "../components/MyPage/OpinionTab";
import ReportTab from "../components/MyPage/ReportTab";
import BookmarkTab from "../components/MyPage/BookmarkTab";
import EditUserInfo from "../components/MyPage/EditUserInfo";
import AlarmManagerTab from "../components/MyPage/AlarmManagerTab";
import { FaBell } from "react-icons/fa";
import { FaUser, FaCommentDots, FaExclamationCircle, FaHatWizard } from "react-icons/fa";
import "../styles/Mypage.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mode, setMode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const defaultTab = location.state?.activeTab || "info";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/users/info`, {
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
      const res = await fetch(`${API_BASE_URL}/api/users`, {
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
                <Nav.Link eventKey="bookmark"><FaUser /> 북마크 목록 </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="opinions"><FaCommentDots /> 한줄평 관리</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports"><FaExclamationCircle /> 신고 내역</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tarot"><FaHatWizard/> 오늘의 타로</Nav.Link>
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
            {activeTab === "password" && (
              <ChangePasswordTab
                userInfo={userInfo}
                setActiveTab={setActiveTab}
                fetchUserInfo={fetchUserInfo} 
                setShowEditComponent={() => setActiveTab("info")}
              />
            )}
            {activeTab === "bookmark" && <BookmarkTab userInfo={userInfo} />}
            {activeTab === "opinions" && <OpinionTab userInfo={userInfo} />}
            {activeTab === "reports" && <ReportTab userInfo={userInfo} />}
            {activeTab === "tarot" && <TodayTarotResultTab userId={userInfo?.userId} />}
            {activeTab === "alarms" && <AlarmManagerTab userInfo={userInfo} />}

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
          else if (mode === "password") setActiveTab("password"); 
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