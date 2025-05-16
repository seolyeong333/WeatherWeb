// src/components/MyPage/OpinionTab.jsx
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OpinionTab({ userInfo }) {
  const [opinions, setOpinions] = useState([]);
  const navigate = useNavigate(); // ✅ 페이지 이동용 hook

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

  // 🔸 클릭 시 placeName를 넘기며 상세페이지로 이동
  const handleOpinionClick = (placeName) => {
    navigate("/today-place/place-detail", { state: { placeName } }); // 🔗 이동 시 state로 전달
  };

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">💬 내가 남긴 한줄평</h5>
        {opinions.length > 0 ? (
          <ul className="list-group list-group-flush">
            {opinions.map((opinion) => (
              <li
                key={opinion.opinionId}
                onClick={() => handleOpinionClick(opinion.placeName)} // ✅ 클릭 시 이동
                className="list-group-item d-flex flex-column align-items-start"
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>📍 장소 이름:</strong> {opinion.placeName}
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
