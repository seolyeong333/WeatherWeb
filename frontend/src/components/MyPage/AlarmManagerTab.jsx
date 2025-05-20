// src/components/MyPage/AlarmManagerTab.jsx
import { useState, useEffect } from "react";
import { Card, Form, Button, Modal, Table } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AlarmManagerTab({ userInfo }) {
  const userId = userInfo?.userId;
  const [conditionType, setConditionType] = useState("");
  const [weatherCondition, setWeatherCondition] = useState([]);
  const [airCondition, setAirCondition] = useState("");
  const [alarmList, setAlarmList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedAlarmId, setSelectedAlarmId] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  // 알람 설정 저장
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/alarms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          conditionType,
          weatherCondition: weatherCondition.join(","),
          airCondition,
        }),
      });

      if (!res.ok) throw new Error("알람 저장 실패");

      setModalMessage("✅ 알람 설정이 완료되었습니다.");
      setShowModal(true);
      fetchAlarms(); // 저장 후 목록 갱신
    } catch (err) {
      console.error("저장 오류:", err);
      setModalMessage("❌ 알람 저장에 실패했습니다.");
      setShowModal(true);
    }
  };

  // 날씨 체크 핸들러
  const handleWeatherCheck = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWeatherCondition((prev) => [...prev, value]);
    } else {
      setWeatherCondition((prev) => prev.filter((c) => c !== value));
    }
  };

  // 알람 목록 조회
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
  }, [userId]);

  // 삭제 요청
  const handleDeleteClick = (alarmId) => {
    setSelectedAlarmId(alarmId);
    setShowConfirmModal(true);
  };

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
      <Card className="mypage-card">
        <Card.Body>
          <h5 className="fw-bold mb-4">🔔 알람 설정</h5>

          <Form.Group className="mb-4">
            <Form.Label>1️⃣ 어떤 조건에 따라 알람을 받고 싶으신가요?</Form.Label>
            <div className="d-flex flex-column">
              <Form.Check type="radio" label="날씨 조건만" value="weather" checked={conditionType === "weather"} onChange={(e) => setConditionType(e.target.value)} />
              <Form.Check type="radio" label="미세먼지 조건만" value="air" checked={conditionType === "air"} onChange={(e) => setConditionType(e.target.value)} />
              <Form.Check type="radio" label="날씨 + 미세먼지 조건" value="both" checked={conditionType === "both"} onChange={(e) => setConditionType(e.target.value)} />
            </div>
          </Form.Group>

          {(conditionType === "weather" || conditionType === "both") && (
            <Form.Group className="mb-4">
              <Form.Label>2️⃣ 알림 받을 날씨</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {["맑음", "흐림", "비", "눈", "천둥번개"].map((condition) => (
                  <Form.Check key={condition} type="checkbox" label={condition} value={condition} checked={weatherCondition.includes(condition)} onChange={handleWeatherCheck} />
                ))}
              </div>
            </Form.Group>
          )}

          {(conditionType === "air" || conditionType === "both") && (
            <Form.Group className="mb-4">
              <Form.Label>3️⃣ 알림 받을 미세먼지 등급</Form.Label>
              <Form.Select value={airCondition} onChange={(e) => setAirCondition(e.target.value)}>
                <option value="">-- 선택하세요 --</option>
                <option value="좋음">좋음</option>
                <option value="보통">보통</option>
                <option value="나쁨">나쁨</option>
                <option value="매우 나쁨">매우 나쁨</option>
              </Form.Select>
            </Form.Group>
          )}

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={
              !conditionType ||
              (conditionType !== "air" && weatherCondition.length === 0) ||
              (conditionType !== "weather" && !airCondition)
            }
          >
            ✅ 알람 설정 완료하기
          </Button>
        </Card.Body>
      </Card>

      {/* 알람 목록 */}
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
                    <td>{alarm.conditionType === "both" ? "날씨+미세먼지" : alarm.conditionType === "weather" ? "날씨" : "미세먼지"}</td>
                    <td>{alarm.weatherCondition || "-"}</td>
                    <td>{alarm.airCondition || "-"}</td>
                    <td>{alarm.createdAt?.slice(0, 16).replace("T", " ")}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(alarm.alarmId)}>삭제</Button>
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

      {/* 공통 모달들 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p>{modalMessage}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowModal(false)}>확인</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p>정말로 이 알람을 삭제하시겠습니까?</p>
          <div className="mt-3 d-flex justify-content-center gap-3">
            <Button variant="danger" onClick={confirmDelete}>삭제</Button>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>취소</Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p>{resultMessage}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowResultModal(false)}>확인</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AlarmManagerTab;
