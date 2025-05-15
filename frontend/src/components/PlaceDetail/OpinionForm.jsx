import React from "react";

function OpinionForm({ opinion, setOpinion, onSubmit }) {
  return (
    <div className="opinion-box mt-4">
      <p>여러분들의 의견을 남겨주세요.</p>
      <textarea
        className="form-control mt-2"
        rows="3"
        value={opinion}
        onChange={(e) => setOpinion(e.target.value)}
        placeholder="한줄평을 입력해주세요"
      />
      <button
        className="btn btn-primary mt-2"
        onClick={onSubmit}
        disabled={!opinion.trim()}
      >
        등록하기
      </button>
    </div>
  );
}

export default OpinionForm;
