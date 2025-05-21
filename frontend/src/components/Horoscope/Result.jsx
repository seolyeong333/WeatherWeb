import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json";
import ColorPickerModal from "../ColorPickerModal";
import { COLORS } from "../../api/colors"; 
import "../../styles/TarotAnimation.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Result({ categoryId, selected }) {
  const [cardInfos, setCardInfos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(""); // 🔮 감성 메시지 상태
  const [showColorModal, setShowColorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

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
          body: JSON.stringify(selected), // 카드 ID 배열 보내기
        });

        const data = await res.json();
        setCardInfos(data.cards);
        setMessage(data.message);
      } catch (err) {
        console.error("타로 결과 요청 실패:", err);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchResult();
    const timer = setTimeout(() => setShowModal(true), 1000);
    return () => clearTimeout(timer);
  }, [categoryId, selected]);

  const handleGoToLook = () => {
    const allColors = cardInfos.flatMap((card) => card.colors.map((c) => c.colorName));
    const luckyColor = allColors[0] || "옐로우";
    navigate("/today-look", {
      state: { color: luckyColor },
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <Lottie animationData={loadingAnimation} loop={true} style={{ width: 200, height: 200 }} />
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>ONDA AI가 당신의 운세를 확인하는 중입니다...</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
        🧙‍♀️ 당신의 오늘의 운세 결과입니다
      </h2>
      <div
  style={{
    display: "flex",
    justifyContent: "space-between", // 카드 간 간격 일정하게
    width: "660px",                  // 카드 3개 + 간격 합친 고정폭
    margin: "0 auto"                 // 부모 기준 가운데 정렬
  }}
>
  {cardInfos.map((c, index) => (
    <div key={index} style={{ textAlign: "center", width: "200px", flexShrink: 0 }}>
      <img
        src={`/tarot/${categoryId}/${c.cardId}.png`}
        alt={`카드 ${c.cardName}`}
        style={{ width: "180px", height: "250px" }}
      />
      <div style={{ marginTop: "0.5rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
        <strong>「{c.cardName}」</strong><br />
        {c.description}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "0.5rem",
            fontSize: "0.95rem",
            color: "#555",
          }}
        >
          {c.colors?.[0] ? (
            <>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: c.colors[0].hexCode || "#ccc",
                  border: "1px solid #aaa",
                  display: "inline-block",
                }}
              ></span>
              <span>{c.colors[0].colorName}</span>
            </>
          ) : (
            <span>색상 없음</span>
          )}
        </div>
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
    <div
      className="modal-content1"
      style={{
        maxWidth: "600px",
        fontSize: "0.95rem",
        lineHeight: "1.6",
        textAlign: "left",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        🔮 오늘의 타로 메시지
      </h3>
      <p style={{ whiteSpace: "pre-line" }}>
        {message}
      </p>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => setShowModal(false)}
          style={{
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
  </div>
)}


      <ColorPickerModal
        show={showColorModal}
        colors={modalColors}
        onClose={() => setShowColorModal(false)}
        onSelect={(color) => {
          setUserColor(color);
          navigate('/today-look', { state: { userColorName: color.name } });
        }}
      />
    </div>
  );
}

export default Result;
