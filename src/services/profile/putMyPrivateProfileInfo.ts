import { privateApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { PROFILE_PRIVATE_PROFILE_API_PATH } from '../appApiPath';

export interface PutMyPrivateProfileInfoReq {
  isPrivateProfile: boolean;
}

export const putMyPrivateProfileInfo = (
  putMyPrivateProfileInfoReq: PutMyPrivateProfileInfoReq,
): Promise<ProfileMyInfo> => {
  return privateApi
    .put(PROFILE_PRIVATE_PROFILE_API_PATH, putMyPrivateProfileInfoReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
