import { createContext, useState } from "react";

// 날씨 관련 상태를 담는 Context
export const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [isRainy, setIsRainy] = useState(false);
  const [isSunny, setIsSunny] = useState(false);
  const [isCloudy, setIsCloudy] = useState(false);
  const [isSnowy, setIsSnowy] = useState(false);
  const [isThunder, setIsThunder] = useState(false);

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
