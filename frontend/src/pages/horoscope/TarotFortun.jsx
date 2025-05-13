// src/components/TarotFortune.jsx
import { useState } from "react";

const tarotCards = [
  { name: "태양", meaning: "오늘은 밝고 힘찬 하루가 될 거예요!" },
  { name: "연인", meaning: "소중한 인연이 찾아올 수 있어요." },
  { name: "운명의 수레바퀴", meaning: "예상치 못한 기회가 찾아올 거예요." },
  { name: "힘", meaning: "조금 힘들지만, 결국 해낼 수 있어요." },
  { name: "은둔자", meaning: "혼자만의 시간이 도움이 될 거예요." }
];

export default function TarotFortune() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const pickCard = () => {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    setSelectedCard(tarotCards[randomIndex]);
    setIsFlipped(true);
  };

  const reset = () => {
    setIsFlipped(false);
    setSelectedCard(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">🔮 오늘의 타로 운세 🔮</h1>

      {!isFlipped ? (
        <div>
          <p className="mb-4">카드를 눌러 오늘의 운세를 확인하세요!</p>
          <div
            className="w-48 h-64 bg-gray-300 rounded-2xl shadow-lg flex items-center justify-center text-4xl cursor-pointer hover:scale-105 transition"
            onClick={pickCard}
          >
            🃏
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-48 h-64 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-4 animate-flip">
            <h2 className="text-2xl font-semibold mb-2">{selectedCard.name}</h2>
            <p className="text-base">{selectedCard.meaning}</p>
          </div>
          <button
            onClick={reset}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            다시 뽑기
          </button>
        </div>
      )}
    </div>
  );
}