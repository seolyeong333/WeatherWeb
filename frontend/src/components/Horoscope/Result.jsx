import React, { useEffect, useState } from "react";
import "./TarotAnimation.css";

function Result({ categoryId, selectedCards, onRestart }) {
  const [cardInfos, setCardInfos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 서버에서 카드 정보 가져오기
    const fetchCardInfo = async () => {
      try {
        const token = localStorage.getItem("token"); // 또는 sessionStorage

        const queryParams = selectedCards.map(i => `cardIds=${i + 1}`).join("&");
        const url = `http://localhost:8080/api/tarot/result?categoryId=${categoryId}&${queryParams}`;

       const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

    const data = await res.json();
    setCardInfos(data); 
    console.log("받아온 카드 정보 : ", data); 
      } catch (err) {
        console.error("타로 카드 결과 불러오기 실패:", err);
      }
    };

    fetchCardInfo();

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000); // 1초 뒤 모달 표시
    return () => clearTimeout(timer);
  }, [categoryId, selectedCards]);

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>🧙‍♀️ 당신의 오늘의 운세 결과입니다</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        {selectedCards.map((index) => (
          <img
            key={index}
            src={`/tarot/${categoryId}/${index + 1}.png`}
            alt={`카드${index + 1}`}
            style={{ width: "180px", height: "250px" }}
          />
        ))}
      </div>
      <button onClick={onRestart} style={{
            marginTop: "3rem",
            padding: "0.8rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#5B8DEF",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}>다시 하기</button>
      {showModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>🔮 오늘의 타로 메시지</h3>
            {cardInfos.map((c, index) => (
              <p key={index}>
                <strong>「{c.cardName}」</strong>: {c.description}, {c.colors[0].colorName}
              </p>
            ))}
          <button onClick={() => setShowModal(false)}>확인</button>
        </div>
      </div>
    )}
    </div>
  );
}

export default Result;