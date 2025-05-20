import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button as BsButton } from "react-bootstrap"; // ✅ Modal과 Button import
import { getUserAuth } from "../../api/jwt"; // getUserAuth는 현재 코드에서 사용되지 않지만, 필요시 유지

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CommentReportTab({ onReportClick }) { // onReportClick prop은 현재 사용되지 않음
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
    const fetchOpinionReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { // 기본적 토큰 존재 여부 확인 (선택적)
          handleShowModal("인증 오류", "로그인이 필요합니다. 다시 로그인해주세요.");
          // navigate("/login"); // 로그인 페이지로 리디렉션
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/opinions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            handleShowModal("인증 오류", "세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.");
            // navigate("/login"); // 로그인 페이지로 리디렉션
          } else {
            handleShowModal("오류", "신고 데이터를 불러오는 데 실패했습니다.");
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const transformed = data.map((r) => ({
          ...r,
          commentText: r.opinionContent,
          placeName: r.placeName, // API 응답에 placeName이 있다고 가정
        }));
        setReports(transformed);
      } catch (error) {
        console.error("🚨 한줄평 신고 로드 실패:", error);
        // 위에서 이미 모달을 통해 사용자에게 알렸을 수 있으므로, 중복 알림 방지 또는 다른 처리
        if (!showModal) { // 이미 다른 모달이 떠있지 않은 경우에만
            handleShowModal("로드 실패", "한줄평 신고 목록을 불러오지 못했습니다.");
        }
      }
    };

    fetchOpinionReports();
  }, [navigate, showModal]); // navigate, showModal을 의존성 배열에 추가 (showModal은 중복 모달 방지용)

  const handleAction = async (reportId, action, opinionId, placeName) => {
    if (action === "보기") {
      navigate("/today-place/place-detail", { state: { placeName } });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        handleShowModal("인증 오류", "로그인이 필요합니다. 다시 로그인해주세요.");
        return;
    }

    let wasActionSuccessful = false;

    try {
      if (action === "무시") {
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/${reportId}/status?status=RESOLVED`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("무시 처리 API 실패");
        handleShowModal("처리 완료", "해당 신고가 무시 처리되었습니다.");
        wasActionSuccessful = true;
      } else if (action === "삭제") {
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/opinions/${opinionId}/delete?reportId=${reportId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("삭제 처리 API 실패");
        handleShowModal("처리 완료", "해당 한줄평이 삭제 처리되었습니다.");
        wasActionSuccessful = true;
      }
    } catch (error) {
      console.error(`🚨 ${action} 처리 실패:`, error);
      handleShowModal("처리 오류", `${action} 처리 중 오류가 발생했습니다.`);
    }

    if (wasActionSuccessful) {
      setReports((prev) => prev.filter((r) => r.reportId !== reportId));
    }
  };

  return (
    <div className="notice-section">
      <h3>🗨️ 한줄평 신고 처리</h3>
      {reports.length === 0 ? (
        <p>신고된 한줄평이 없습니다.</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>신고 ID</th>
              <th>신고자</th>
              <th>신고 내용</th>
              <th>신고된 한줄평</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId}>
                <td>{report.reportId}</td>
                <td>{report.reporterNickname}</td>
                <td>{report.content}</td>
                <td>{report.commentText}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "보기", report.targetId, report.placeName)}
                  >
                    보기
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "무시", report.targetId)}
                  >
                    무시
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(report.reportId, "삭제", report.targetId)}
                  >
                    삭제
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

export default CommentReportTab;