// ✅ hooks/time.js

export const toKST = (utcDate) => {
    const date = new Date(utcDate);
    return new Date(date.getTime() + 9 * 60 * 60 * 1000);
  };
  
  export const getTodayKST = () => {
    const now = new Date();
    return new Date(now.getTime() + 9 * 60 * 60 * 1000);
  };
  
  export const getTodayDateNumberKST = () => {
    return getTodayKST().getUTCDate();
  };
  