import { privateApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { PROFILE_GENDER_EDIT_API_PATH } from '../appApiPath';

export interface PutMyProfileGenderInfoReq {
  gender: string;
}

export const putMyProfileGenderInfo = (
  putMyProfileGenderInfoReq: PutMyProfileGenderInfoReq,
): Promise<ProfileMyInfo> => {
  return privateApi
    .put(PROFILE_GENDER_EDIT_API_PATH, putMyProfileGenderInfoReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
