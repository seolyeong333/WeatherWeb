// hooks/time.js
// 한국 표준시(KST)로 시간 변환 관련 유틸 함수 모음

/**
 * UTC 날짜/문자열을 KST(Date 객체)로 변환
 * @param {string | Date} utcDate - UTC 기반 날짜/시간 문자열
 * @returns {Date} - KST 기준 Date 객체
 */
export const toKST = (utcDate) => {
  const date = new Date(utcDate);
  return new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC + 9시간
};

/**
 * 현재 시각을 KST 기준으로 반환
 * @returns {Date}
 */
export const getTodayKST = () => {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000);
};

/**
 * 오늘 날짜(KST 기준)의 '일(day)' 숫자만 반환
 * @returns {number} 예: 1 ~ 31
 */
export const getTodayDateNumberKST = () => {
  return getTodayKST().getUTCDate();
};
