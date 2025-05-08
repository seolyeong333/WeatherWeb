import { createContext, useState } from "react";

// ✅ 날씨 상태들을 전역에서 관리하기 위한 Context 생성
export const WeatherContext = createContext();

/**
 * WeatherProvider 컴포넌트
 * - 앱 전체에서 날씨 상태를 공유하고 업데이트할 수 있도록 해주는 Provider
 * - 비, 맑음, 흐림, 눈, 천둥 상태를 전역에서 사용할 수 있음
 *
 * 사용 예:
 * <WeatherProvider>
 *    <App />
 * </WeatherProvider>
 */
export function WeatherProvider({ children }) {
  // 🔽 날씨 상태 정의
  const [isRainy, setIsRainy] = useState(false);      // 🌧️ 비
  const [isSunny, setIsSunny] = useState(false);      // ☀️ 맑음
  const [isCloudy, setIsCloudy] = useState(false);    // ☁️ 흐림
  const [isSnowy, setIsSnowy] = useState(false);      // ❄️ 눈
  const [isThunder, setIsThunder] = useState(false);  // ⛈️ 천둥

  // Context로 하위 컴포넌트에 상태와 setter 전달
  return (
    <WeatherContext.Provider value={{
      isRainy, setIsRainy,
      isSunny, setIsSunny,
      isCloudy, setIsCloudy,
      isSnowy, setIsSnowy,
      isThunder, setIsThunder,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}
