import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import { getUserAuth } from "../../api/jwt";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CommentReportTab({ onReportClick }) {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // ✅ 네비게이터 훅 사용

  useEffect(() => {
    const fetchOpinionReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/admin/reports/opinions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("신고 데이터를 불러오는 데 실패했습니다.");
        }

        const data = await res.json();
        const transformed = data.map((r) => ({
          ...r,
          commentText: r.opinionContent,
          placeName: r.placeName,
        }));

        setReports(transformed);
      } catch (error) {
        console.error("🚨 한줄평 신고 로드 실패:", error);
      }
    };

    fetchOpinionReports();
  }, []);

  const handleAction = async (reportId, action, opinionId, placeName) => {
    if (action === "보기") {
      // ✅ 상세페이지로 이동 (placeName을 state로 전달)
      navigate("/today-place/place-detail", { state: { placeName } });
      return;
    }

    if (action === "무시") {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/admin/reports/${reportId}/status?status=RESOLVED`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("무시 처리 완료");
    }

    if (action === "삭제") {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE_URL}/api/admin/reports/opinions/${opinionId}/delete?reportId=${reportId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  alert("삭제 처리 완료");
}


    setReports((prev) => prev.filter((r) => r.reportId !== reportId));
  };

  return (
    <div className="notice-section">
      <h3>🗨️ 한줄평 신고 처리</h3>
      {reports.length === 0 ? (
        <p>신고된 한줄평이 없습니다.</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>신고 ID</th>
              <th>신고자</th>
              <th>신고 내용</th>
              <th>신고된 한줄평</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId}>
                <td>{report.reportId}</td>
                <td>{report.reporterNickname}</td>
                <td>{report.content}</td>
                <td>{report.commentText}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "보기", report.targetId, report.placeName)}
                  >
                    보기
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "무시", report.targetId)}
                  >
                    무시
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(report.reportId, "삭제", report.targetId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CommentReportTab;
