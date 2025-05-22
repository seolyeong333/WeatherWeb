import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Row, Col, Nav,  Tabs, Tab, Modal, Button } from "react-bootstrap";// AdminPage.jsx 상단에 
import Header from "../components/Header";
import UserListTab from "../components/Admin/UserListTab";
import PlaceReportTab from "../components/Admin/PlaceReportTab";
import CommentReportTab from "../components/Admin/CommentReportTab";
import AdminUserDetailModal from "../components/Admin/AdminUserDetailModal";
import AdminPlaceReportModal from "../components/Admin/AdminPlaceReportModal";
import AdminCommentReportModal from "../components/Admin/AdminCommentReportModal";
import { isLoggedIn, getUserAuth } from "../api/jwt";
import "../styles/AdminPage.css"; // MyPage.css 구조와 동일한 스타일 정의

function AdminPage() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlaceReport, setSelectedPlaceReport] = useState(null);
  const [selectedCommentReport, setSelectedCommentReport] = useState(null);

  useEffect(() => {
    if (!isLoggedIn() || getUserAuth() !== "ADMIN") {
      setUnauthorized(true);
    } else {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab("users");
    }
  }, [location.search]);

  const handleSelect = (k) => {
    setActiveTab(k);
    navigate(`?tab=${k}`, { replace: true });
  };


  if (unauthorized) {
    return (
      <Modal show centered>
        <Modal.Header>
          <Modal.Title>🚫 잘못된 접근</Modal.Title>
        </Modal.Header>
        <Modal.Body>관리자 권한이 없거나 로그인되지 않았습니다.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/")}>
            메인으로 이동
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (!authChecked) return null;

  return (
    <>
      <Header />
      <div className="admin-wrapper">
      <div className="admin-wrapper container mt-5 mb-5">
        <h2 className="fw-bold mb-4">🛠️ 관리자 페이지</h2>
        <Row>
          <Col md={3} className="mb-3">
            <Nav
              variant="pills"
              className="flex-column shadow-sm rounded-3 p-3 bg-light"
              activeKey={activeTab}
              onSelect={handleSelect}
            >
              <Nav.Item>
                <Nav.Link eventKey="users">👤 사용자 목록</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="places">📍 장소 신고</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comments">💬 한줄평 신고</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            {activeTab === "users" && <UserListTab onUserClick={setSelectedUser} />}
            {activeTab === "places" && <PlaceReportTab onReportClick={setSelectedPlaceReport} />}
            {activeTab === "comments" && <CommentReportTab onReportClick={setSelectedCommentReport} />}
          </Col>
        </Row>
      </div>
        {/* 모달 */}
        <AdminUserDetailModal show={!!selectedUser} onHide={() => setSelectedUser(null)} user={selectedUser} />
        <AdminPlaceReportModal show={!!selectedPlaceReport} onHide={() => setSelectedPlaceReport(null)} report={selectedPlaceReport} />
        <AdminCommentReportModal show={!!selectedCommentReport} onHide={() => setSelectedCommentReport(null)} report={selectedCommentReport} />
      </div>
    </>
  );
}

export default AdminPage;
