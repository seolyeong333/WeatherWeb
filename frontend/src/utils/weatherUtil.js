// 날씨 설명 매핑용 객체
export const weatherDescriptionMap = {
  "튼구름": "구름 많음", "구름 많음": "구름 많음",
  "맑음": "맑음",
  "비": "비",  "보통 비": "비", "강한 비": "비",
  "눈": "눈",
  "실 비": "이슬비",
  "소나기": "소나기",
  "천둥번개": "뇌우",
  "구름조금": "흐림", "튼구름": "흐림",
  "연무": "흐림", "박무": "흐림",
  "흐림": "흐림", "온흐림": "흐림"
};

// 한글 날씨 설명 → 정규화된 분류
export function getKoreanWeatherDescription(desc) {
  return weatherDescriptionMap[desc] || "기타";
}

export function getKoreanWeatherDescforWeather(openWeatherDesc) {
  return weatherDescriptionMap[openWeatherDesc] || openWeatherDesc;
}
