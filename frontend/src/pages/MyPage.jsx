// src/pages/MyPage.jsx
import { useState, useEffect, useRef  } from "react";
import { Nav, Row, Col, Modal, Button as BsButton } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import PasswordCheckModal from "../components/MyPage/PasswordCheckModal";
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
  const [showPasswordCheckModal, setShowPasswordCheckModal] = useState(false); // 이름 변경: PasswordCheckModal 전용
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // 회원 탈퇴 확인 모달 전용
  const [mode, setMode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const infoModalCallback = useRef(null);

  //  알림/오류 메시지 모달 상태
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState("");
  const [infoModalMessage, setInfoModalMessage] = useState("");

  // activeTab 초기값 설정 및 location.state에 따른 업데이트
  const [activeTab, setActiveTab] = useState("info"); // 기본값 'info'

  useEffect(() => {
    // location.state에 activeTab이 있으면 해당 탭으로 설정
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    } else {
      setActiveTab("info"); // 기본 탭으로 명시적 설정
    }
  }, [location.state]); // location.state 변경 시 마다 실행

  // ✅ 알림/오류 모달 제어 함수
  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    if (infoModalCallback.current) {
      infoModalCallback.current(); // 콜백 실행
      infoModalCallback.current = null; // 초기화
    }
  };
  
  const handleShowInfoModal = (title, message, callback) => {
    setInfoModalTitle(title);
    setInfoModalMessage(message);
    setShowInfoModal(true);
    infoModalCallback.current = callback || null; // ✅ 이 줄 추가해야 navigate 실행됨
  };
  
  const setShowEditComponent = () => {
    setActiveTab("info");
  };
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleShowInfoModal("인증 오류", "로그인이 필요합니다. 로그인 페이지로 이동합니다.", () => navigate("/")); // 
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/users/info`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("사용자 정보를 불러오지 못했습니다.");
      const data = await res.json();
      setUserInfo(data);
    } catch (err) {
      console.error("유저 정보 요청 실패:", err);
      handleShowInfoModal("오류", "사용자 정보를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem("token"); // 토큰은 PasswordCheckModal 성공 후 이미 확인되었을 수 있지만, 안전하게 다시 포함
      if (!userInfo?.email) { // PasswordCheckModal에서 비밀번호만 확인하고 이메일은 여기서 사용
          handleShowInfoModal("오류", "사용자 정보가 없어 탈퇴를 진행할 수 없습니다.");
          return;
      }
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // DELETE 요청에도 인증 토큰 필요
        },
        body: JSON.stringify({ email: userInfo.email, 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "탈퇴 실패");
      }

      localStorage.removeItem("token");
      handleShowInfoModal("탈퇴 완료", "회원 탈퇴가 완료되었습니다. 홈으로 이동합니다.", () => navigate("/")); // ✅ 홈 경로 수정
    } catch (err) {
      console.error("탈퇴 실패:", err);
      handleShowInfoModal("탈퇴 오류", err.message || "탈퇴 중 오류가 발생했습니다.");
    }
  };

  // UserInfoTab에서 "회원 탈퇴" 버튼 클릭 시 호출될 함수
  const handleDeleteAccountRequest = () => {
    setMode("delete");
    setShowPasswordCheckModal(true);
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
              className="flex-column shadow-sm rounded-3 p-3 bg-light mypage-nav" // 커스텀 클래스 추가
              activeKey={activeTab}
              onSelect={(selectedKey) => setActiveTab(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="info"><FaUser className="me-2" />내 정보</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="bookmark"><FaUser className="me-2" />북마크 목록</Nav.Link> {/* 아이콘 통일 필요 시 FaBookmark 등 */}
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="opinions"><FaCommentDots className="me-2" />한줄평 관리</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reports"><FaExclamationCircle className="me-2" />신고 내역</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tarot"><FaHatWizard className="me-2"/>오늘의 타로</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="alarms"><FaBell className="me-2"/>알림 설정</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            {activeTab === "info" && (
              <UserInfoTab
                userInfo={userInfo}
                setMode={setMode} // PasswordCheckModal을 띄우기 위한 mode 설정용
                setShowPasswordCheckModal={setShowPasswordCheckModal} // PasswordCheckModal을 띄우는 함수 전달
                handleDeleteRequest={handleDeleteAccountRequest} // 회원 탈퇴 요청 함수 전달
              />
            )}
            {activeTab === "edit" && userInfo && ( // userInfo가 있을 때만 렌더링
              <EditUserInfo
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                fetchUserInfo={fetchUserInfo}
                setShowEditComponent={setShowEditComponent} 
              />
            )}
            {activeTab === "password" && userInfo && ( // userInfo가 있을 때만 렌더링
              <ChangePasswordTab
                userInfo={userInfo} // 현재는 사용 안하지만 필요할 수 있음
                onPasswordChanged={() => {
                  setActiveTab("info");
                }}
                setShowEditComponent={setShowEditComponent} 
              
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
        show={showPasswordCheckModal}
        onHide={() => setShowPasswordCheckModal(false)}
        mode={mode} // 'edit', 'password', 'delete'
        onSuccess={() => {
          setShowPasswordCheckModal(false);
          if (mode === "edit") {
            setActiveTab("edit");
          } else if (mode === "password") {
            setActiveTab("password");
          } else if (mode === "delete") {
            setShowConfirmDeleteModal(true);
          }
        }}
        email={userInfo?.email}
      />

      {/* 회원 탈퇴 확인 모달 */}
      <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>회원 탈퇴 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</Modal.Body>
        <Modal.Footer>
          <BsButton variant="danger" onClick={() => {
            setShowConfirmDeleteModal(false); // 먼저 모달을 닫고
            deleteAccount();                 // 그 다음 탈퇴 함수 실행
          }}>
            탈퇴
          </BsButton>
          <BsButton variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>
            취소
          </BsButton>
        </Modal.Footer>
      </Modal>

      {/* 일반 알림/오류 메시지 모달 */}
      <Modal show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{infoModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{infoModalMessage}</Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={handleCloseInfoModal}>
            닫기
          </BsButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyPage;