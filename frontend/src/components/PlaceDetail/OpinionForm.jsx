import React, { useState } from "react";
import "./OpinionForm.css";

function OpinionForm({ opinion, setOpinion, onSubmit }) {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit({ content: opinion, rating: rating });
    setRating(0); // 제출 후 초기화
  };

  return (
    <div className="opinion-box mt-4">
      {/* 제목 + 별점을 나란히 정렬 */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <p className="mb-0" style={{ fontWeight: "bold" }}>여러분의 의견을 남겨주세요</p>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= rating ? "star selected" : "star"}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="d-flex gap-2 mt-2">
        <textarea
          className="form-control"
          rows="3"
          style={{ flex: 1 }}
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="한줄평을 입력해주세요"
        />
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!opinion.trim() || rating === 0}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}

export default OpinionForm;
