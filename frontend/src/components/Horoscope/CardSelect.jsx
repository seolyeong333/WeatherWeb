import React, { useState, useEffect } from "react";
import { shuffleArray } from "../../utils/shuffle";
import "../../styles/TarotAnimation.css";

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
      console.log("Clicked card:", cardId);
      setSelected([...selected, cardId]);
    }
  };

  const handleReveal = () => {
    setFlippedCards(selected);   // 선택된 카드 앞면 표시
    console.log(selected);
    setRevealing(true);          

    setTimeout(() => {
      onFinish(selected);                // Result.jsx로 이동
    }, 1500); // 1.5초 후
  };

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const chunkSize = shuffledCards.length === 12 ? 6 : 5;

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
    <div style={{ position: "absolute", top: "43%", left: "50%", transform: "translate(-50%, -50%)",color: "#fff", textAlign: "center", textShadow: "0 0 25px rgba(213, 183, 15, 0.6)" }}>
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
        {chunkArray(shuffledCards, chunkSize).map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {row.map((cardId, displayIndex) => (
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
      ))}

      <button
        onClick={handleReveal}
        disabled={selected.length !== 3 || revealing}
        style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}
        className={`tarot-result-button ${selected.length === 3 ? "active" : "inactive"}`}
      >
        결과 보기
      </button>
    </div>
    </div>
  );
}

export default CardSelect;