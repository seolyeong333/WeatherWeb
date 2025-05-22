// src/utils/zodiac.js
export function getZodiacSign(birthday) {
  if (!birthday) return "";

  const [year, month, day] = birthday.split("-").map(Number);
  const mmdd = (month * 100) + day;

  if (mmdd >= 120 && mmdd <= 218) return "♒ 물병자리";
  if (mmdd >= 219 && mmdd <= 320) return "🐟 물고기자리";
  if (mmdd >= 321 && mmdd <= 419) return "🐏 양자리";
  if (mmdd >= 420 && mmdd <= 520) return "🐂 황소자리";
  if (mmdd >= 521 && mmdd <= 621) return "👯 쌍둥이자리";
  if (mmdd >= 622 && mmdd <= 722) return "🦀 게자리";
  if (mmdd >= 723 && mmdd <= 822) return "🦁 사자자리";
  if (mmdd >= 823 && mmdd <= 923) return "👧 처녀자리";
  if (mmdd >= 924 && mmdd <= 1023) return "⚖️ 천칭자리";
  if (mmdd >= 1024 && mmdd <= 1122) return "🦂 전갈자리";
  if (mmdd >= 1123 && mmdd <= 1221) return "🏹 사수자리";
  if (mmdd >= 1222 || mmdd <= 119) return "🐐 염소자리";

  return "";
}
