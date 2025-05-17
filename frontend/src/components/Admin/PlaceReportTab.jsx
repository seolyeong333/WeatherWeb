import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAuth, isLoggedIn } from "../../api/jwt";

function PlaceReportTab() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (getUserAuth() !== "ADMIN") {
      alert("접근 권한이 없습니다.");
      return;
    }

    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/admin/reports/place", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("신고 데이터를 불러올 수 없습니다.");

      const data = await res.json();

      const placeReports = data
        .filter((r) => r.status !== "RESOLVED") // ✅ 무시된 신고는 숨김
        .map((r) => ({
          reportId: r.reportId,
          reporterNickname: r.reporterNickname || "(알 수 없음)",
          placeName: r.placeName || r.targetId,
          reason: r.content,
          status: r.status,
        }));

      setReports(placeReports);
    } catch (err) {
      console.error("🚨 장소 신고 로드 실패:", err);
      alert("장소 신고 데이터를 불러오는 데 실패했습니다.");
    }
  };

  const handleAction = async (reportId, action, placeName) => {
    const token = localStorage.getItem("token");

    if (action === "보기") {
      navigate("/today-place/place-detail", {
        state: {
          placeName,
          flagged: true, // 🚨 경고 표시
        },
      });
      return;
    }

    if (action === "무시") {
      try {
        await fetch(`http://localhost:8080/api/admin/reports/${reportId}/status?status=RESOLVED`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("무시 처리 완료");
      } catch {
        alert("무시 처리 중 오류 발생");
      }
    }

    if (action === "처리") {
      await fetch("http://localhost:8080/api/admin/reports/flag-place", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeName }),
      });
      alert("처리 완료: 해당 장소는 앞으로 경고 문구가 표시됩니다.");
    }


    setReports((prev) => prev.filter((r) => r.reportId !== reportId));
  };

  return (
    <div className="notice-section">
      <h3>📍 장소 신고 처리</h3>
      {reports.length === 0 ? (
        <p>신고된 장소가 없습니다.</p>
      ) : (
        <table className="notice-table">
          <thead>
            <tr>
              <th>신고 ID</th>
              <th>신고자</th>
              <th>장소명</th>
              <th>신고 내용</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.reportId}>
                <td>{report.reportId}</td>
                <td>{report.reporterNickname}</td>
                <td>{report.placeName}</td>
                <td>{report.reason}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "보기", report.placeName)}
                  >
                    보기
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "무시", report.placeName)}
                  >
                    무시
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(report.reportId, "처리", report.placeName)}
                  >
                    처리
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

export default PlaceReportTab;
