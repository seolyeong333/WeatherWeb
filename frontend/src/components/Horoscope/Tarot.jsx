import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../../styles/TarotAnimation.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Intro({ onStart }) {
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
      const totalTimeout = setTimeout(() => onStart(selectedCategory), 1800);
      return () => {
        clearTimeout(gatherTimeout);
        clearTimeout(totalTimeout);
      };
    }
  }, [selectedCategory, isShuffling, onStart]);

  const handleCardClick = (index) => {
    setSelectedIndex(index);
    setSelectedCategory(index + 1);
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
    } catch (err) {
      console.error("타로 체크 실패:", err);
      setModalMessage("서버 오류로 타로를 시작할 수 없습니다.");
      setShowModal(true);
    }
  };

  const cardClass = `intro-cards ${isShuffling ? "shuffle-sequence" : ""} ${step === "swap" ? "step2" : ""}`;

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
            className={`tarot-card ${selectedCategory === index + 1 ? "selected" : ""}`}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {!isShuffling && (
        <button
          onClick={handleStart}
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
