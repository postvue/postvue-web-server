import { LOGIN_PATH } from 'const/PathConst';
import { SERVER_PATH } from 'const/SystemAttrConst';

export const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID || ''; //NAVER CLIENT ID
export const NAVER_CALLBACK_URL = `${SERVER_PATH}${LOGIN_PATH}`; //callback url
export const NAVER_LOGIN_CODE_QUERY_PARAM = 'code';
