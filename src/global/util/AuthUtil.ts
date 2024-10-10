import { BEARER_AUTH_KEY } from 'const/AuthConst';
import { ACCESS_TOKEN } from 'const/LocalStorageConst';
import { resetMyAccountSettingInfo } from './MyAccountSettingUtil';

export const getAccessTokenByBearer = (accessToken: string): string => {
  return `${BEARER_AUTH_KEY} ${accessToken}`;
};

export const resetAccountInfoByLogout = (): void => {
  resetMyAccountSettingInfo();
  localStorage.removeItem(ACCESS_TOKEN);
};
