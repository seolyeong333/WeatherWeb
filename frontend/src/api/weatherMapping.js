// 날씨 설명을 한국어로 자연스럽게 바꿔주는 매핑 테이블
// (OpenWeather에서 오는 기본 날씨 상태값 → 우리가 사용자에게 보여줄 표현으로 매핑)
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

/**
 * OpenWeather에서 받은 날씨 설명을 → 우리가 쓰는 표현으로 변환해주는 함수
 * 예: "튼구름" → "구름 많음"
 * 만약 매핑이 없으면 원본 그대로 반환함
 */
export function getKoreanWeatherDescription(openWeatherDesc) {
  return weatherDescriptionMap[openWeatherDesc] || openWeatherDesc;
}
