// import axios from 'axios';
import { KAKAO_CLIDENT_ID, KAKAO_REDIRECT_URI } from 'const/login/KakaoConst';
import { kauthApi } from 'services';

interface postKauthTokenRes {
  scope: string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
}

interface postKauthTokenReq {
  grant_type: string;
  client_id: string;
  redirect_uri: string;
  code: string;
}

// Point 가져오기
export const postKakaoAuthToken = (
  code: string,
): Promise<postKauthTokenRes> => {
  const data: postKauthTokenReq = {
    grant_type: 'authorization_code',
    client_id: KAKAO_CLIDENT_ID,
    redirect_uri: KAKAO_REDIRECT_URI,
    code: code,
  };

  return kauthApi
    .post(`/oauth/token`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
