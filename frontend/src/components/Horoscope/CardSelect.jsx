import React, { useState } from "react";

function CardSelect({ categoryId, onFinish }) {
  const [selected, setSelected] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // 앞면 보여줄 카드
  const [revealing, setRevealing] = useState(false); // 결과 보여주기 중

  const handleCardClick = (index) => {
    if (selected.includes(index)) {
      // 이미 선택한 카드 → 제거
      setSelected(selected.filter((i) => i !== index));
    } else if (selected.length < 3) {
      // 최대 3장까지 선택 가능
      setSelected([...selected, index]);
    }
  };

  const handleReveal = () => {
    setFlippedCards(selected);   // 선택된 카드 앞면 표시
    setRevealing(true);          

    setTimeout(() => {
      onFinish(selected);                // Result.jsx로 이동
    }, 1500); // 1.5초 후
  };

  const cards = Array.from({ length: 10 }, (_, i) => i); 

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>3장의 카드를 선택하세요</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {cards.map((_, index) => (
          <img
              key={index}
              className={`tarot-card 
                ${selected.includes(index) ? "selected" : ""}
                ${flippedCards.includes(index) ? "flipped" : ""}`}
              src={
                flippedCards.includes(index)
                  ? `/tarot/${categoryId}/${index + 1}.png`
                  : `/tarot/tarot-back${categoryId}.png`
              }
              alt={`카드${index + 1}`}
              onClick={() => !revealing && handleCardClick(index)}
              style={{
                width: "160px",
                height: "225px",
            }}
          />
        ))}
      </div>

      <button
        onClick={handleReveal}
        disabled={selected.length !== 3 || revealing}
        style={{
          backgroundColor: selected.length === 3 ? "#5B8DEF" : "#ccc",
          color: "#fff",
          padding: "0.8rem 2rem",
          fontSize: "1rem",
          border: "none",
          borderRadius: "10px",
          cursor: selected.length === 3 ? "pointer" : "not-allowed",
        }}
      >
        결과 보기
      </button>
    </div>
  );
}

export default CardSelect;