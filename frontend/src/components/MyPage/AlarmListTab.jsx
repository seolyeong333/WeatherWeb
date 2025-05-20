import { useState, useEffect } from "react";
import { Card, Table, Button, Modal } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AlarmListTab({ userId, refreshKey }) {
  const [alarmList, setAlarmList] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  const fetchAlarms = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/alarms?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlarmList(data);
    } catch (err) {
      console.error("알람 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    if (userId) fetchAlarms();
  }, [userId, refreshKey]);

  // ❌ 삭제 버튼 클릭 → 확인 모달 열기
  const handleDeleteClick = (alarmId) => {
    setSelectedAlarmId(alarmId);
    setShowConfirmModal(true);
  };

  // ✅ 삭제 수행
  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/alarms/${selectedAlarmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("삭제 실패");

      setResultMessage("✅ 알람이 성공적으로 삭제되었습니다.");
      setShowConfirmModal(false);
      setShowResultModal(true);
      fetchAlarms();
    } catch (err) {
      console.error("삭제 오류:", err);
      setResultMessage("❌ 알람 삭제에 실패했습니다.");
      setShowConfirmModal(false);
      setShowResultModal(true);
    }
  };

  return (
    <>
      <Card className="mypage-card mt-4">
        <Card.Body>
          <h5 className="fw-bold mb-4">📋 등록된 알람 목록</h5>
          {alarmList.length > 0 ? (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>조건 유형</th>
                  <th>날씨 조건</th>
                  <th>미세먼지 조건</th>
                  <th>등록일</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {alarmList.map((alarm, idx) => (
                  <tr key={alarm.alarmId}>
                    <td>{idx + 1}</td>
                    <td>
                      {alarm.conditionType === "both"
                        ? "날씨+미세먼지"
                        : alarm.conditionType === "weather"
                        ? "날씨"
                        : "미세먼지"}
                    </td>
                    <td>{alarm.weatherCondition || "-"}</td>
                    <td>{alarm.airCondition || "-"}</td>
                    <td>{alarm.createdAt?.slice(0, 16).replace("T", " ")}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(alarm.alarmId)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>등록된 알람이 없습니다.</p>
          )}
        </Card.Body>
      </Card>

      {/* ❗삭제 확인 모달 */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p style={{ fontSize: "1.1rem" }}>정말로 이 알람을 삭제하시겠습니까?</p>
          <div className="mt-3 d-flex justify-content-center gap-3">
            <Button variant="danger" onClick={confirmDelete}>
              삭제
            </Button>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              취소
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* ✅ 결과 안내 모달 */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p style={{ fontSize: "1.1rem" }}>{resultMessage}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowResultModal(false)}>
              확인
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AlarmListTab;
