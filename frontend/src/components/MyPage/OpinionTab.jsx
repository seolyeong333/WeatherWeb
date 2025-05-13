// src/components/MyPage/OpinionTab.jsx
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";

function OpinionTab({ userInfo }) {
  const [opinions, setOpinions] = useState([]);

  useEffect(() => {
    if (!userInfo?.userId) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/opinions?userId=${userInfo.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setOpinions)
      .catch((err) => console.error("한줄평 불러오기 실패", err));
  }, [userInfo]);

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">💬 내가 남긴 한줄평</h5>
        {opinions.length > 0 ? (
          <ul className="list-group list-group-flush">
            {opinions.map((opinion) => (
              <li
                key={opinion.opinionId}
                className="list-group-item d-flex flex-column align-items-start"
              >
                <div>
                  <strong>📍 장소 ID:</strong> {opinion.placeId}
                </div>
                <div>
                  <strong>💬 내용:</strong> {opinion.content}
                </div>
                <div className="d-flex gap-3 mt-1">
                  <span>👍 {opinion.likes}</span>
                  <span>👎 {opinion.dislikes}</span>
                  <span>🕒 {opinion.createdAt?.substring(0, 16)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 한줄평이 없습니다.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default OpinionTab;
