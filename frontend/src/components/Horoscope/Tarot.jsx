import React, { useState, useEffect } from "react";
import "../../styles/TarotAnimation.css";

function Intro({ onStart }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [step, setStep] = useState("gather"); // 'gather' | 'swap'
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [shuffleImageIndex, setShuffleImageIndex] = useState(null);

  const getCategoryName = (id) => {
    switch (id) {
      case 1:
        return "날씨";
      case 2:
        return "별자리";
      case 3:
        return "랜덤";
      default:
        return "";
    }
  };

  useEffect(() => {
    if ( selectedCategory && isShuffling) {
      // 1단계: 카드 모이기 후 → swap으로 전환
      const gatherTimeout = setTimeout(() => {
        setStep("swap");
      }, 1000); // gather가 확실히 끝난 후

      // 전체 종료 → 카드 선택으로
      const totalTimeout = setTimeout(() => {
        onStart(selectedCategory);
      }, 1800); // swap까지 모두 끝난 후

      return () => {
        clearTimeout(gatherTimeout);
        clearTimeout(totalTimeout);
      };
    }
  }, [selectedCategory, isShuffling, onStart]);

  const handleCardClick = (index) => {
    setSelectedIndex(index);
    let categoryId;
    if (index === 0 ) categoryId = 1; // 기본: 날씨 타로
    else if (index === 1) categoryId = 2;
    else if (index === 2) categoryId = 3; // 두 번째 카드 클릭 시 → 별자리 타로
    // console.log(index);
    setSelectedCategory(categoryId);
  };

  const cardClass = `intro-cards ${isShuffling ? "shuffle-sequence" : ""} ${step === "swap" ? "step2" : ""}`;

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif"}}>오늘 당신의 운세 및 색상을 확인하세요.</h2>
      <div className={cardClass}>
        {[1, 2, 3].map((n, index) => (
          <img
            key={index}
            src={
              isShuffling && shuffleImageIndex !== null
              ? `/tarot/tarot-back${shuffleImageIndex + 1}.png`
              : `/tarot/tarot-back${n}.png`}
            alt={`카드${n}`}
            className={`tarot-card ${selectedCategory === (index + 1) ? "selected" : ""}`}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      {!isShuffling && (
        <button
          onClick={() => {
            if (selectedIndex !== null) {
                setShuffleImageIndex(selectedIndex); // 👉 Start 버튼 누를 때만 셔플 이미지 결정
                setIsShuffling(true);
                setStep("gather");
              } else {
                alert("카드를 먼저 선택해주세요!");
              }
            }}
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
          {selectedCategory ? `${getCategoryName(selectedCategory)} 타로 Start` : "카드를 선택하세요"}
        </button>
      )}
    </div>
  );
}

export default Intro;