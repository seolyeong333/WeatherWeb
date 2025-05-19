import { useState, useEffect } from "react";
import { Card, Table, Button } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AlarmListTab({ userId, refreshKey }) {
  const [alarmList, setAlarmList] = useState([]);

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

  // 🔁 목록 새로고침
  useEffect(() => {
    if (userId) fetchAlarms();
  }, [userId, refreshKey]);

  // ❌ 알람 삭제 요청
  const handleDelete = async (alarmId) => {
    const token = localStorage.getItem("token");
    const confirm = window.confirm("이 알람을 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/alarms/${alarmId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("삭제 실패");
      alert("삭제되었습니다.");
      fetchAlarms(); // 삭제 후 리스트 새로고침
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("알람 삭제에 실패했습니다.");
    }
  };

  return (
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
                      onClick={() => handleDelete(alarm.alarmId)}
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
  );
}

export default AlarmListTab;
