import React from "react";
import OpinionItem from "./OpinionItem";

function OpinionList({ opinions, onLike, rating, onDislike, onReport }) {
  return (
    <div className="opinion-list mt-4">
      <h4>💬 한줄평</h4>
      {opinions.length === 0 ? (
        <p className="text-muted">등록된 한줄평이 없습니다.</p>
      ) : (
        <ul className="list-group">
          {opinions.map((opinion) => (
            <OpinionItem
              key={opinion.opinionId}
              rating={rating}
              opinion={opinion}
              onLike={onLike}
              onDislike={onDislike}
              onReport={onReport}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default OpinionList;