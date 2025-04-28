// 날씨 설명 자연스러운 한국어로 바꿔주는 매핑 테이블
export const weatherDescriptionMap = {
    "튼구름": "구름 많음",
    "온흐림": "흐림",
    "박무": "안개",
    "맑음": "맑음",
    "비": "비",
    "눈": "눈",
    "소나기": "소나기",
    "천둥번개": "뇌우",
    "연무": "연무",
    "흐림": "흐림"
  };
  
  // OpenWeather 설명을 자연스럽게 반환하는 함수
  export function getKoreanWeatherDescription(openWeatherDesc) {
    return weatherDescriptionMap[openWeatherDesc] || openWeatherDesc;
  }
  