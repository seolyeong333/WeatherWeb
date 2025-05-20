// hooks/useAlarmSSE.js
import { useEffect, useRef } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useAlarmSSE(token, onReceiveAlarm) {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const connect = () => {
      const sseUrl = `${API_BASE_URL}/api/alarm/subscribe?token=${token}`;
      console.log("🔍 SSE 연결 시도 주소:", sseUrl);

      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.addEventListener("CONNECTED", (e) => {
        console.log("✅ SSE 연결됨:", e.data);
      });

      eventSource.addEventListener("ALARM", (e) => {
        console.log("📩 알림 수신:", e.data);
        onReceiveAlarm(e.data);
      });

      eventSource.onerror = (e) => {
        console.error("❌ SSE 연결 오류:", e);
        eventSource.close();

        // 🔁 3초 후 재연결 시도
        setTimeout(() => {
          console.log("♻️ SSE 재연결 시도...");
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [token, onReceiveAlarm]);
}

export default useAlarmSSE;