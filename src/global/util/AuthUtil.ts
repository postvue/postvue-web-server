import { BEARER_AUTH_KEY } from 'const/AuthConst';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';

export const getAccessTokenByBearer = (accessToken: string): string => {
  return `${BEARER_AUTH_KEY} ${accessToken}`;
};

export const resetAccountInfoByLogout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN);
};

export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem(ACCESS_TOKEN); // 또는 쿠키에서 가져오기
  if (!token) return false;

  // 토큰 만료 확인 (옵션)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};
