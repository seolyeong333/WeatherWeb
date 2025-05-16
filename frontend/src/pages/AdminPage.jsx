import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Tabs, Tab, Modal, Button } from "react-bootstrap";

import UserListTab from "../components/Admin/UserListTab";
import PlaceReportTab from "../components/Admin/PlaceReportTab";
import CommentReportTab from "../components/Admin/CommentReportTab";
import AdminUserDetailModal from "../components/Admin/AdminUserDetailModal";
import AdminPlaceReportModal from "../components/Admin/AdminPlaceReportModal";
import AdminCommentReportModal from "../components/Admin/AdminCommentReportModal";

function AdminPage() {
  const navigate = useNavigate();

  const [authChecked, setAuthChecked] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false); // 🔸 접근 거부 모달 상태

  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPlaceReport, setSelectedPlaceReport] = useState(null);
  const [selectedCommentReport, setSelectedCommentReport] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUnauthorized(true);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.auth !== "ADMIN") {
        setUnauthorized(true);
        return;
      }
      setAuthChecked(true); // ✅ 인증 통과
    } catch (err) {
      console.error("토큰 파싱 오류:", err);
      setUnauthorized(true);
    }
  }, []);

  // ✅ 권한 미통과 → 모달만 보여줌
  if (unauthorized) {
    return (
      <Modal show centered>
        <Modal.Header>
          <Modal.Title>🚫 잘못된 접근</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          관리자 권한이 없거나 로그인되지 않았습니다.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/main")}>
            메인으로 이동
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (!authChecked) return null; // 아직 검사 중이면 아무것도 렌더링 안 함

  return (
    <>
      <Header />
      <div className="admin-wrapper container mt-5 mb-5">
        <h2 className="fw-bold mb-4">🔧 관리자 페이지</h2>

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="users" title="👤 사용자 목록">
            <UserListTab onUserClick={setSelectedUser} />
          </Tab>
          <Tab eventKey="places" title="📍 장소 신고">
            <PlaceReportTab onReportClick={setSelectedPlaceReport} />
          </Tab>
          <Tab eventKey="comments" title="💬 한줄평 신고">
            <CommentReportTab onReportClick={setSelectedCommentReport} />
          </Tab>
        </Tabs>

        {/* 상세 모달들 */}
        <AdminUserDetailModal show={!!selectedUser} onHide={() => setSelectedUser(null)} user={selectedUser} />
        <AdminPlaceReportModal show={!!selectedPlaceReport} onHide={() => setSelectedPlaceReport(null)} report={selectedPlaceReport} />
        <AdminCommentReportModal show={!!selectedCommentReport} onHide={() => setSelectedCommentReport(null)} report={selectedCommentReport} />
      </div>
    </>
  );
}

export default AdminPage;
