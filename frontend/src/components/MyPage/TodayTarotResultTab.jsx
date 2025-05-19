import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TodayTarotResultTab() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/api/tarot/mylogs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("오늘의 타로 결과 불러오기 실패:", err);
      }
    };

    fetchResult();
  }, []);

  if (!logs || logs.length === 0) {
    return (
      <Card className="mypage-card">
        <Card.Body>
          <h5 className="fw-semibold mb-3">🔮 오늘의 타로 결과</h5>
          <p>오늘의 타로 기록이 없습니다.</p>
        </Card.Body>
      </Card>
    );
  }

  const todayLog = logs[0];
  const cardIds = todayLog.cardIds?.split(",") || [];
  const cardColors = todayLog.cardColors?.split(",") || [];

  const handleImageError = (e, id) => {
    const currentSrc = e.target.src;
    if (currentSrc.includes("/tarot/1/")) {
      e.target.src = `/tarot/2/${id}.png`;
    } else if (currentSrc.includes("/tarot/2/")) {
      e.target.src = `/tarot/3/${id}.png`;
    } else {
      e.target.alt = "이미지 없음";
    }
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">🔮 오늘의 타로 결과</h5>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
          {cardIds.map((id, idx) => (
            <div key={idx} style={{ textAlign: "center", flex: "1 0 120px" }}>
              <img
                src={`/tarot/1/${id}.png`}
                alt={`카드 ${id}`}
                onError={(e) => handleImageError(e, id)}
                style={{ width: "120px", height: "180px" }}
              />
              <p className="mt-2">카드 {id}</p>
              <p style={{ fontSize: "0.9rem", color: "#888" }}>
                🎨 {cardColors[idx] || "색상 없음"}
              </p>
            </div>
          ))}
        </div>

        <hr style={{ marginTop: "2rem" }} />
        <p style={{ whiteSpace: "pre-line", fontSize: "1rem", lineHeight: "1.6" }}>
          {todayLog.description}
        </p>
      </Card.Body>
    </Card>
  );
}

export default TodayTarotResultTab;
