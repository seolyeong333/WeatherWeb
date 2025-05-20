import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { fetchTodayTarotLogs } from "../../api/tarot"; 
import { COLORS } from "../../api/colors"; 
import ColorPickerModal from "../ColorPickerModal";

function TodayTarotResultTab() {
  const [logs, setLogs] = useState([]);
  const [showColorModal, setShowColorModal] = useState(false);
  const [userColor, setUserColor] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadLogs = async () => {
      const data = await fetchTodayTarotLogs();
      setLogs(data);
    };
    loadLogs();
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
  const modalColors = COLORS.filter(c => cardColors.includes(c.name));

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
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => setShowColorModal(true)}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              backgroundColor: "#5B8DEF",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            행운의 색상 코디 확인하기
          </button>
        </div>
        <ColorPickerModal
          show={showColorModal}
          colors={modalColors}
          onClose={() => setShowColorModal(false)}
          onSelect={(color) => {
            setUserColor(color); // { name, hex }
            navigate('/today-look', { state: { userColorName: color.name } });
          }}
        />
      </Card.Body>
    </Card>
  );
}

export default TodayTarotResultTab;
