import { privateApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { PROFILE_EMAIL_EDIT_API_PATH } from '../appApiPath';

export interface PutMyProfileEmailInfoReq {
  email: string;
}

export const putMyProfileEmailInfo = (
  putMyProfileEmailInfoReq: PutMyProfileEmailInfoReq,
): Promise<ProfileMyInfo> => {
  return privateApi
    .put(PROFILE_EMAIL_EDIT_API_PATH, putMyProfileEmailInfoReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
