export function getSeasonalMessage() {
  const month = new Date().getMonth() + 1; // getMonth()는 0~11이므로 +1

  if (month >= 3 && month <= 4) {
    return "봄날의 따사로운 햇살과 어울리는 오늘의 색상";
  } else if (month >= 5 && month <= 8) {
    return "여름의 청량한 바람과 잘 어울리는 오늘의 색상";
  } else if (month >= 9 && month <= 11) {
    return "가을의 포근한 분위기와 어울리는 오늘의 색상";
  } else {
    return "겨울의 차분한 감성과 잘 어울리는 오늘의 색상";
  }
}
