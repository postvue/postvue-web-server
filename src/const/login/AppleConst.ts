import { LOGIN_PATH } from 'const/PathConst';
import { SERVER_PATH } from 'const/SystemAttrConst';

export const APPLE_SOCIAL_CLIENT_ID =
  process.env.REACT_APP_APPLE_SOCIAL_SERVICE_CLIENT_ID || ''; //NAVER CLIENT ID
export const APPLE_SOCIAL_CALLBACK_URL = `${SERVER_PATH}${LOGIN_PATH}`; //callback url
export const APPLE_SOCIAL_LOGIN_CODE_QUERY_PARAM = 'code';
