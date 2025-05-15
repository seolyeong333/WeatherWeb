import { useEffect, useState } from "react";

function CommentReportTab({ onReportClick }) {
  const [reports, setReports] = useState([]);

  // ✅ 통합 reports 테이블 기반 목데이터
  useEffect(() => {
    const mockData = [
      {
        reportId: 1,
        reporterNickname: "장준하",
        targetType: "opinion",
        targetId: "op123",
        content: "욕설이 포함된 한줄평입니다.",
        commentText: "진짜 별로임",
        status: "PENDING",
      },
      {
        reportId: 2,
        reporterNickname: "장준환",
        targetType: "opinion",
        targetId: "op456",
        content: "광고성 내용입니다.",
        commentText: "이거 보러 오세요 www.example.com",
        status: "PENDING",
      },
    ];

    const opinionReports = mockData.filter((r) => r.targetType === "opinion");
    setReports(opinionReports);
  }, []);

  const handleAction = (reportId, action) => {
    alert(`신고 ID ${reportId}에 대해 '${action}' 처리되었습니다.`);
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
                <td>
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => onReportClick(report)}
                  >
                    보기
                  </button>
                  <button
                    className="btn btn-success btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "완료")}
                  >
                    완료
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => handleAction(report.reportId, "무시")}
                  >
                    무시
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(report.reportId, "삭제")}
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
