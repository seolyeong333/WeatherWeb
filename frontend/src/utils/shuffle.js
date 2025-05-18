// src/utils/shuffle.js

/**
 * Fisher-Yates 알고리즘을 이용한 배열 셔플
 * @param {Array} array - 섞을 배열 (원본은 보존됨)
 * @returns {Array} - 섞인 새 배열
 */

export function shuffleArray(array) {
  const result = [...array]; // 원본 배열 복사
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}