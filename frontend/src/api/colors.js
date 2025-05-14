// src/api/colors.js

// ✅ 프론트에서 사용하는 색상 목록 (색 이름 + HEX 컬러값)
// - ColorPickerModal, TodayLook 등에서 색상 박스 렌더링 시 사용됨
export const COLORS = [
  { name: "베이지", hex: "#E5DED3" }, { name: "카키", hex: "#7A8450" },
  { name: "옐로우", hex: "#F6D850" }, { name: "오렌지", hex: "#FF8A00" },
  { name: "레드", hex: "#E63B2E" }, { name: "와인", hex: "#803434" },
  { name: "브라운", hex: "#836244" }, { name: "네이비", hex: "#1C2C7C" },
  { name: "블루", hex: "#3B61E2" }, { name: "그린", hex: "#45A56B" },
  { name: "퍼플", hex: "#8659D1" }, { name: "그레이", hex: "#9C9C9C" },
  { name: "블랙", hex: "#000000" }, { name: "실버", hex: "#EEEEEE" },
  { name: "골드", hex: "#E4CD6C" }, { name: "민트", hex: "#B9EAD9" },
  { name: "라벤더", hex: "#D8C6F1" }, { name: "화이트", hex: "#FFFFFF" },
  { name: "스카이블루", hex: "#BCE5F1" }, { name: "핑크", hex: "#F9CCE1" }
];

// ✅ 한글 색상 이름을 "예쁜 영어 이름"으로 변환해주는 함수
// - TodayLook 화면에서 텍스트 표기용 (ex. "그린" → "Botanic Green")
export function fancyName(kor) {
  const dict = {
    "베이지": "Cream Beige", "카키": "Olive Khaki", "옐로우": "Citron Yellow",
    "오렌지": "Sunset Orange", "레드": "Cherry Red", "와인": "Vintage Wine",
    "브라운": "Mocha Brown", "네이비": "Deep Navy", "블루": "Royal Blue",
    "그린": "Botanic Green", "퍼플": "Lavender Purple", "그레이": "Ash Gray",
    "블랙": "Jet Black", "실버": "Soft Silver", "골드": "Champagne Gold",
    "민트": "Pastel Mint", "라벤더": "Lilac Lavender", "화이트": "Pure White",
    "스카이블루": "Sky Blue", "핑크": "Blush Pink"
  };
  return dict[kor] || kor; // fallback: 입력이 없으면 그대로 반환
}

// ✅ 매일 날짜에 따라 고정된 색상 하나를 랜덤처럼 반환하는 함수
// - 오늘의 색상 박스, 첫 화면 초기 크롤링에 사용됨
export function getTodayColor() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash += today.charCodeAt(i);


  // 실버, 골드를 제외한 색상 배열
  const filteredColors = COLORS.filter(
    color => color.name !== "실버" && color.name !== "골드"
  );

  return filteredColors[hash % filteredColors.length];
}
