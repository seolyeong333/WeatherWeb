import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorPickerModal from "../ColorPickerModal";
import { COLORS } from "../../api/colors"; 
import "../../styles/TarotAnimation.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Result({ categoryId, selectedCards }) {
  const [cardInfos, setCardInfos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(""); // 🔮 감성 메시지 상태
  const [showColorModal, setShowColorModal] = useState(false);
  const resultColors = [...new Set(
    cardInfos.flatMap(c => c.colors.map(cl => cl.colorName))
    )];
  const modalColors = COLORS.filter(c => resultColors.includes(c.name));
  const [userColor, setUserColor] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${API_BASE_URL}/api/tarot/result?categoryId=${categoryId}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedCards), // 카드 ID 배열 보내기
        });

        const data = await res.json();
        setCardInfos(data.cards);     // 카드 정보
        setMessage(data.message);     // 감성 메시지
        console.log("🎴 카드 정보:", data.cards);
        console.log("🔮 감성 메시지:", data.message);
      } catch (err) {
        console.error("타로 결과 요청 실패:", err);
      }
    };

    fetchResult();

    const timer = setTimeout(() => setShowModal(true), 1000);
    return () => clearTimeout(timer);
  }, [categoryId, selectedCards]);

  const handleGoToLook = () => {
    const allColors = cardInfos.flatMap((card) => card.colors.map((c) => c.colorName));
    const luckyColor = allColors[0] || "옐로우";

    navigate("/today-look", {
      state: { color: luckyColor },
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
        🧙‍♀️ 당신의 오늘의 운세 결과입니다
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        {cardInfos.map((c, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <img
              src={`/tarot/${categoryId}/${c.cardId}.png`}
              alt={`카드 ${c.cardName}`}
              style={{ width: "180px", height: "250px" }}
            />
            <div style={{ marginTop: "0.5rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
              <strong>「{c.cardName}」</strong><br />
              {c.description} <br/>
              🎨 {c.colors?.[0]?.colorName || "색상 없음"}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowColorModal(true)}
        style={{
          marginTop: "3rem",
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: "2rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
              🔮 오늘의 타로 메시지
            </h3>
            <p style={{ whiteSpace: "pre-line", fontSize: "1.1rem", lineHeight: "1.6" }}>
              {message}
            </p>
            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "2rem",
                padding: "0.6rem 1.5rem",
                fontSize: "0.95rem",
                backgroundColor: "#5B8DEF",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
      
      <ColorPickerModal
        show={showColorModal}
        colors={modalColors}
        onClose={() => setShowColorModal(false)}
        onSelect={(color) => {
          setUserColor(color); // { name, hex }
          navigate('/today-look', { state: { userColorName: color.name } });
        }}
      />
    </div>
  );
}

export default Result;
