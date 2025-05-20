import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ReportTab({ userInfo }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!userInfo?.userId) return;

    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/api/reports?userId=${userInfo.userId}`, {
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
          <ul className="list-unstyled">
          {reports.map((report) => (
            <li key={report.reportId} className="list-item">
              <div className="list-header">
                <div className="list-text">
                  {report.targetType === "place" && (
                    <div><strong>📍 장소 이름:</strong> {report.placeName}</div>
                  )}
                  <div><strong>📝 내용:</strong> {report.content}</div>
                  <div>
                  <strong>📌 상태:</strong>{" "}
                  {report.status === "PENDING"
                    ? "처리중.."
                    : report.status === "RESOLVED"
                    ? "처리완료"
                    : report.status}
                </div>
                  <div><strong>🕒 작성일:</strong> {report.createdAt?.substring(0, 16)}</div>
                </div>
              </div>
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
