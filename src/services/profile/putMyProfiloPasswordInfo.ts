import { privateApi } from '..';
import { ProfileAccessToken } from '../../global/interface/profile';
import { PROFILE_PASSWORD_EDIT_API_PATH } from '../appApiPath';

export interface PutMyProfilePasswordInfoReq {
  currentPassword: string;
  password: string;
}

export const putMyProfilePasswordInfo = (
  putMyProfilePasswordInfoReq: PutMyProfilePasswordInfoReq,
): Promise<ProfileAccessToken> => {
  return privateApi
    .put(PROFILE_PASSWORD_EDIT_API_PATH, putMyProfilePasswordInfoReq)
    .then((res) => {
      return res.data.data;
    })
    .catch((error) => {
      console.log('에러', error);
      throw error;
    });
};
