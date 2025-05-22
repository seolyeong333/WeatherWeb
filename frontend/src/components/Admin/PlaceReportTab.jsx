import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button as BsButton } from "react-bootstrap"; // ✅ Modal과 Button import (Button 별칭 사용)
import { getUserAuth, isLoggedIn } from "../../api/jwt";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PlaceReportTab() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  // ✅ 모달 상태 추가
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // ✅ 모달 제어 함수
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      handleShowModal("알림", "로그인이 필요합니다."); // ✅ alert 대신 모달 사용
      // 로그인 페이지로 리디렉션 또는 다른 UI 처리 고려 가능
      // navigate("/login");
      return;
    }

    if (getUserAuth() !== "ADMIN") {
      handleShowModal("권한 오류", "접근 권한이 없습니다."); // ✅ alert 대신 모달 사용
      // 이전 페이지로 리디렉션 또는 다른 UI 처리 고려 가능
      // navigate(-1);
      return;
    }

    fetchReports();
  }, [navigate]); // navigate를 의존성 배열에 추가 (만약 위에서 navigate 사용 시)

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/reports/place`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("신고 데이터를 불러올 수 없습니다.");
      const data = await res.json();
      const placeReports = data
        .filter((r) => r.status !== "RESOLVED")
        .map((r) => ({
          reportId: r.reportId,
          reporterNickname: r.reporterNickname || "(알 수 없음)",
          placeName: r.placeName || r.targetId,
          reason: r.content,
          status: r.status,
        }));
      setReports(placeReports);
    } catch (err) {
      console.error("🚨 장소 신고 로드 실패:", err);
      handleShowModal("오류", "장소 신고 데이터를 불러오는 데 실패했습니다."); // ✅ alert 대신 모달 사용
    }
  };

  const handleAction = async (reportId, action, placeName) => {
    const token = localStorage.getItem("token");
    let actionSuccess = false; // 액션 성공 여부 플래그

    if (action === "보기") {
      navigate("/today-place/place-detail", {
        state: { placeName, flagged: true },
      });
      return;
    }

    if (action === "무시") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/${reportId}/status?status=RESOLVED`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("무시 처리 API 실패");
        handleShowModal("처리 완료", "무시 처리되었습니다."); // ✅ alert 대신 모달 사용
        actionSuccess = true;
      } catch (error) {
        console.error("무시 처리 중 오류:", error);
        handleShowModal("오류", "무시 처리 중 오류가 발생했습니다."); // ✅ alert 대신 모달 사용
      }
    }

    if (action === "처리") {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/flag-place`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ placeName }),
        });
        if (!res.ok) throw new Error("장소 플래그 처리 API 실패");
        handleShowModal("처리 완료", "해당 장소는 앞으로 경고 문구가 표시됩니다."); // ✅ alert 대신 모달 사용
        actionSuccess = true;
      } catch (error) {
        console.error("플래그 처리 중 오류:", error);
        handleShowModal("오류", "장소 플래그 처리 중 오류가 발생했습니다.");
      }
    }

    if (actionSuccess) { // "보기" 액션이 아닐 때만 목록에서 제거
        setReports((prev) => prev.filter((r) => r.reportId !== reportId));
    }
  };

  return (
    <div className="notice-section" style={{ marginTop: "-0.3rem", height: "100%" }}>
      <h3>📍 장소 신고 처리</h3>
      {reports.length === 0 ? (
        <p>신고된 장소가 없습니다.</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>신고 ID</th>
              <th>신고자</th>
              <th>장소명</th>
              <th>신고 내용</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId}>
                <td>{report.reportId}</td>
                <td>{report.reporterNickname}</td>
                <td>{report.placeName}</td>
                <td>{report.reason}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "보기", report.placeName)}
                  >
                    보기
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "무시", report.placeName)}
                  >
                    무시
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(report.reportId, "처리", report.placeName)}
                  >
                    처리
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ 알림용 Modal 컴포넌트 */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <BsButton variant="secondary" onClick={handleCloseModal}>
            닫기
          </BsButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PlaceReportTab;