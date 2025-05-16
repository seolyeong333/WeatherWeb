import React from "react";

function OpinionItem({ opinion, onLike, onDislike, onReport }) {
  const fullStars = "★".repeat(opinion.rating);
  const emptyStars = "☆".repeat(5 - opinion.rating);

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between">
        <strong>{opinion.content}</strong>
        <div className="text-warning" style={{ fontSize: "1.1rem" }}>
          {fullStars}{emptyStars}
        </div>
      </div>

      <div className="d-flex gap-2 mt-1 small text-muted align-items-center">
        <span>👍 {opinion.likes}</span>
        <span>👎 {opinion.dislikes}</span>
        <span>🕒 {opinion.createdAt?.substring(2, 16)}</span>
        <button className="btn btn-sm btn-outline-success" onClick={() => onLike(opinion.opinionId)}>👍</button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDislike(opinion.opinionId)}>👎</button>
        <button className="btn btn-sm btn-outline-warning" onClick={() => onReport(opinion.opinionId)}>🚨</button>
      </div>
    </li>
  );
}

export default OpinionItem;
