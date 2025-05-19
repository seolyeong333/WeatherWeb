import React from "react";
import "../../styles/PlaceDetail/OpinionItem.css";

function OpinionItem({ opinion, onLike, onDislike, onReport }) {
  const fullStars = "★".repeat(opinion.rating);
  const emptyStars = "☆".repeat(5 - opinion.rating);

  return (
    <li className="opinion-item">
      <div className="opinion-top">
        <div className="opinion-stars">{fullStars}{emptyStars}</div>
        <div className="opinion-meta">
          <span>{opinion.createdAt?.substring(2, 16)}</span>
          <button className="report-btn" onClick={() => onReport(opinion.opinionId)}>🚨</button>
        </div>
      </div>
      <div className="opinion-content">
        <p>{opinion.content}</p>
      </div>
    </li>
  );
}

export default OpinionItem;
