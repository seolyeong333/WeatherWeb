// WT를 파싱해서 payload 반환
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// 로그인 여부 반환 (토큰 존재 여부)
export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// 현재 로그인된 사용자의 권한 반환 ('ADMIN', 'USER', null)
export function getUserAuth() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.auth || null;
}

// 현재 로그인된 사용자의 이메일 반환 (없으면 null)
export function getUserEmail() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.email || null;
}

// 현재 로그인된 사용자의 닉네임 반환 (없으면 null)
export function getUserNickname() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.nickname || null;
}

export function getUserGender() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = parseJwt(token);
  return payload?.gender || null;
}