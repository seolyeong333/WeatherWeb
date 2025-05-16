// src/components/MyPage/AlarmTab.jsx
import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

function AlarmTab({ userInfo }) {
  const userId = userInfo?.userId;
  const [conditionType, setConditionType] = useState("");
  const [weatherCondition, setWeatherCondition] = useState([]);
  const [airCondition, setAirCondition] = useState("");

  const handleWeatherCheck = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setWeatherCondition((prev) => [...prev, value]);
    } else {
      setWeatherCondition((prev) => prev.filter((c) => c !== value));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/alarms", {
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
      alert("알람 설정이 완료되었습니다.");
    } catch (err) {
      console.error("저장 오류:", err);
      alert("알람 저장에 실패했습니다.");
    }
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-bold mb-4">🔔 알람 설정</h5>

        {/* 조건 유형 선택 */}
        <Form.Group className="mb-4">
          <Form.Label>1️⃣ 어떤 조건에 따라 알람을 받고 싶으신가요?</Form.Label>
          <div className="d-flex flex-column">
            <Form.Check
              type="radio"
              label="날씨 조건만"
              value="weather"
              checked={conditionType === "weather"}
              onChange={(e) => setConditionType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="미세먼지 조건만"
              value="air"
              checked={conditionType === "air"}
              onChange={(e) => setConditionType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="날씨 + 미세먼지 조건"
              value="both"
              checked={conditionType === "both"}
              onChange={(e) => setConditionType(e.target.value)}
            />
          </div>
        </Form.Group>

        {/* 날씨 조건 선택 */}
        {(conditionType === "weather" || conditionType === "both") && (
          <Form.Group className="mb-4">
            <Form.Label>2️⃣ 알림 받을 날씨를 선택하세요</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              {["맑음", "흐림", "비", "눈", "천둥번개"].map((condition) => (
                <Form.Check
                  key={condition}
                  type="checkbox"
                  label={condition}
                  value={condition}
                  checked={weatherCondition.includes(condition)}
                  onChange={handleWeatherCheck}
                />
              ))}
            </div>
          </Form.Group>
        )}

        {/* 공기 조건 선택 */}
        {(conditionType === "air" || conditionType === "both") && (
          <Form.Group className="mb-4">
            <Form.Label>3️⃣ 알림 받을 미세먼지 등급을 선택하세요</Form.Label>
            <Form.Select
              value={airCondition}
              onChange={(e) => setAirCondition(e.target.value)}
            >
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
  );
}

export default AlarmTab;
