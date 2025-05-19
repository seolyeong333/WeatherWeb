// src/api/tarot.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 오늘의 타로 결과 로그 가져오기 (마이페이지 등에서 사용)
export async function fetchTodayTarotLogs() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE_URL}/api/tarot/mylogs`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("서버 응답 실패");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("오늘의 타로 결과 불러오기 실패:", err);
    return [];
  }
}