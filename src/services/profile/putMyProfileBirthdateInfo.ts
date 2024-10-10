import { privateApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { PROFILE_BIRTHDATE_EDIT_API_PATH } from '../appApiPath';

export interface PutMyProfileBirthdateInfoReq {
  birthdate: string;
}

export const putMyProfileBirthdateInfo = (
  putMyProfileBirthdateInfoReq: PutMyProfileBirthdateInfoReq,
): Promise<ProfileMyInfo> => {
  return privateApi
    .put(PROFILE_BIRTHDATE_EDIT_API_PATH, putMyProfileBirthdateInfoReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
