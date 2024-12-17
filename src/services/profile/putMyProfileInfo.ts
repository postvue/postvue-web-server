import { formApi } from '..';
import { ProfileMyInfo } from '../../global/interface/profile';
import { INFO_PATH, MY_PATH, PROFILE_LIST_PATH } from '../appApiPath';

export interface PutMyProfileInfoReq {
  nickname: string;
  website: string;
  introduce: string;
}

export const putMyProfileInfo = (
  formData: FormData,
): Promise<ProfileMyInfo> => {
  return formApi
    .put(`${PROFILE_LIST_PATH}${MY_PATH}${INFO_PATH}`, formData)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
