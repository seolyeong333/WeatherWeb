import { useEffect, useState } from "react";

function PlaceReportTab() {
  const [reports, setReports] = useState([]);

  // ✅ 통합 reports 테이블 구조 기반 목데이터
  const dummyAllReports = [
    {
      reportId: 1,
      reporterNickname: "유저A",
      targetId: "ChIJZ6FYjR-8ezUR0LhYALJqZ1I",
      targetType: "place",
      content: "부적절한 이미지 포함",
      status: "PENDING",
      placeName: "카페 온다", // 임시 표시용 필드
    },
    {
      reportId: 2,
      reporterNickname: "유저B",
      targetId: "op123",
      targetType: "opinion",
      content: "욕설 포함됨",
      status: "PENDING",
    },
    {
      reportId: 3,
      reporterNickname: "유저C",
      targetId: "ChIJL6wn6oL6ezURVZkrsFYv1UQ",
      targetType: "place",
      content: "잘못된 위치 정보",
      status: "RESOLVED",
      placeName: "공원 A",
    },
  ];

  useEffect(() => {
    // ✅ targetType이 'place'인 것만 필터링
    const placeReports = dummyAllReports
      .filter((r) => r.targetType === "place")
      .map((r) => ({
        ...r,
        reason: r.content, // 기존 UI 호환을 위한 필드 매핑
      }));
    setReports(placeReports);
  }, []);

  const handleAction = (reportId, action) => {
    const newStatus = action === "처리완료" ? "RESOLVED" : action;
    const updated = reports.map((r) =>
      r.reportId === reportId ? { ...r, status: newStatus } : r
    );
    setReports(updated);
    alert(`신고 ${reportId} 처리: ${action}`);
  };

  return (
    <div>
      <h4 className="fw-bold mb-3">📍 장소 신고 목록</h4>
      {reports.length === 0 ? (
        <p>신고된 장소가 없습니다.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>번호</th>
              <th>신고자</th>
              <th>장소명</th>
              <th>신고내용</th>
              <th>처리상태</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, idx) => (
              <tr key={r.reportId}>
                <td>{idx + 1}</td>
                <td>{r.reporterNickname}</td>
                <td>{r.placeName || r.targetId}</td>
                <td>{r.reason}</td>
                <td>{r.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-1"
                    onClick={() => handleAction(r.reportId, "처리완료")}
                  >
                    완료
                  </button>
                  <button
                    className="btn btn-secondary btn-sm me-1"
                    onClick={() => handleAction(r.reportId, "무시")}
                  >
                    무시
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction(r.reportId, "삭제")}
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

export default PlaceReportTab;
