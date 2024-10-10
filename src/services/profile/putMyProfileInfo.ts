import { privateApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { INFO_PATH, MY_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export interface PutMyProfileInfoReq {
  profilePath: string;
  nickname: string;
  website: string;
  introduce: string;
}

export const putMyProfileInfo = (
  putMyProfileInfoReq: PutMyProfileInfoReq,
): Promise<ProfileMyInfo> => {
  return privateApi
    .put(`${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}`, putMyProfileInfoReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
