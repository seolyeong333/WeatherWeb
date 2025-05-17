import React, { useState, useEffect } from "react";
import { shuffleArray } from "../../utils/shuffle";

function CardSelect({ categoryId, onFinish }) {
  const [selected, setSelected] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // 앞면 보여줄 카드
  const [revealing, setRevealing] = useState(false); // 결과 보여주기 중
  const [shuffledCards, setShuffledCards] = useState([]); // 카드 랜덤으로 순서 배열

  const handleCardClick = (cardId) => {
    if (selected.includes(cardId)) {
      // 이미 선택한 카드 → 제거
      setSelected(selected.filter((i) => i !== cardId));
    } else if (selected.length < 3) {
      // 최대 3장까지 선택 가능
      setSelected([...selected, cardId]);
    }
  };

  const handleReveal = () => {
    setFlippedCards(selected);   // 선택된 카드 앞면 표시
    setRevealing(true);          

    setTimeout(() => {
      onFinish(selected);                // Result.jsx로 이동
    }, 1500); // 1.5초 후
  };

  useEffect(() => {
    // categoryId별 카드 ID 범위 설정
    const categoryRanges = {
      1: { start: 1, end: 10 },
      2: { start: 11, end: 22 },
      3: { start: 23, end: 35 },
    };

    const { start, end } = categoryRanges[categoryId] || { start: 1, end: 10 };

    const rawIds = [];
    for (let i = start; i <= end; i++) {
      rawIds.push(i);
    }

    const shuffled = shuffleArray(rawIds);
    setShuffledCards(shuffled);
  }, [categoryId]);

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
        {shuffledCards.map((cardId, displayIndex) => (
          <img
              key={displayIndex}
              className={`tarot-card 
                ${selected.includes(cardId) ? "selected" : ""}
                ${flippedCards.includes(cardId) ? "flipped" : ""}`}
              src={
                flippedCards.includes(cardId)
                  ? `/tarot/${categoryId}/${cardId}.png`
                  : `/tarot/tarot-back${categoryId}.png`
              }
              alt={`카드${cardId}`}
              onClick={() => !revealing && handleCardClick(cardId)}
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