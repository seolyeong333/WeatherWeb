import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../styles/TarotAnimation.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Intro({ onStart, onShufflingStart }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [step, setStep] = useState("gather");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [shuffleImageIndex, setShuffleImageIndex] = useState(null);

  // ✅ 모달 상태
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const getCategoryName = (id) => {
    switch (id) {
      case 1: return "날씨";
      case 2: return "별자리";
      case 3: return "랜덤";
      default: return "";
    }
  };

  useEffect(() => {
    if (selectedCategory && isShuffling) {
      const gatherTimeout = setTimeout(() => setStep("swap"), 1000);
      const swapTimeout = setTimeout(() => setStep("step3"), 1900);
      const totalTimeout = setTimeout(() => onStart(selectedCategory), 2000);
      return () => {
        clearTimeout(gatherTimeout);
        clearTimeout(swapTimeout)
        clearTimeout(totalTimeout);
      };
    }
  }, [selectedCategory, isShuffling, onStart]);

  const handleCardClick = (index) => {
    setSelectedIndex(index);

    if (index === 2) {
      const randomCategory = Math.random() < 0.5 ? 1 : 2;
      setSelectedCategory(randomCategory);
    } else {
      setSelectedCategory(index + 1);
    }
  };

  const handleStart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setModalMessage("로그인이 필요합니다. 로그인 후 이용해주세요!");
      setShowModal(true);
      return;
    }

    if (selectedIndex === null) {
      setModalMessage("카드를 먼저 선택해주세요!");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/tarot/check`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.played) {
        setModalMessage("오늘의 타로는 이미 진행하셨습니다. 내일 다시 시도해주세요!");
        setShowModal(true);
        return;
      }

      setShuffleImageIndex(selectedIndex);
      setIsShuffling(true);
      setStep("gather");

      if (onShufflingStart) {
        onShufflingStart();
      }
    } catch (err) {
      console.error("타로 체크 실패:", err);
      setModalMessage("서버 오류로 타로를 시작할 수 없습니다.");
      setShowModal(true);
    }
  };

  const cardClass = `intro-cards ${isShuffling ? "shuffle-sequence" : ""} ${step === "swap" ? "step2" : ""} ${step === "step3" ? "step3" : ""}`;

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h2 style={{ marginBottom: "3rem", fontFamily: "'Gowun Dodum', sans-serif" }}>
        오늘 당신의 운세 및 색상을 확인하세요.
      </h2>

      <div className={cardClass}>
        {[1, 2, 3].map((n, index) => (
          <img
            key={index}
            src={
              isShuffling && shuffleImageIndex !== null
                ? `/tarot/tarot-back${shuffleImageIndex + 1}.png`
                : `/tarot/tarot-back${n}.png`
            }
            alt={`카드${n}`}
            className={`tarot-card ${selectedIndex === index && !isShuffling ? "selected" : ""}`}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {!isShuffling && (
        <button style={{ marginTop: "2.5rem", fontFamily: "'Gowun Dodum', sans-serif" }}
          className="tarot-btn" onClick={handleStart}>
          {selectedIndex === 2 ? "랜덤 타로 Start" : selectedCategory ? `${getCategoryName(selectedCategory)} 타로 Start` : "카드를 선택하세요"}
        </button>
      )}

      {/* ✅ 알림 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p style={{ fontSize: "1.1rem" }}>{modalMessage}</p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => setShowModal(false)}>
              확인
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Intro;
