// src/components/MyPage/ReportTab.jsx
import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";

function ReportTab({ userInfo }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!userInfo?.userId) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/reports?userId=${userInfo.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setReports)
      .catch((err) => console.error("신고 내역 불러오기 실패", err));
  }, [userInfo]);

  return (
    <Card className="mypage-card">
      <Card.Body>
        <h5 className="fw-semibold mb-3">🚨 신고한 내역</h5>
        <p>총 <strong>{reports.length}</strong>건의 신고를 접수했습니다.</p>
        {reports.length > 0 ? (
          <ul className="list-group list-group-flush">
            {reports.map((report) => (
              <li
                key={report.reportId}
                className="list-group-item d-flex flex-column align-items-start"
              >
                <div><strong>📄 신고자 고유 아이디:</strong> {report.userId}</div>
                <div><strong>📝 내용:</strong> {report.content}</div>
                <div><strong>❗ 신고 대상 고유 아이디:</strong> {report.targetId}</div>
                <div><strong>🕒 작성일:</strong> {report.createdAt?.substring(0, 16)}</div>
                <div><strong>📌 상태:</strong> {report.status}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 신고한 내용이 없습니다.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default ReportTab;
