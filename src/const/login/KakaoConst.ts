import { LOGIN_PATH } from 'const/PathConst';
import { SERVER_PATH } from 'const/SystemAttrConst';

//@REFER: REACT_APP_REST_API_KEY가 다른 곳에서 쓰이는 지?
export const KAKAO_CLIDENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID || ''; //REST API KEY
export const KAKAO_REDIRECT_URI = `${SERVER_PATH}${LOGIN_PATH}`; //Redirect URI
export const KAKAO_SDK_KEY = process.env.REACT_APP_KAKAO_SDK_KEY || '';
export const KAKAO_AUTH_URL = process.env.REACT_APP_KAUTH_URL;
export const KAKAO_LOGIN_CODE_QUERY_PARAM = 'code';
