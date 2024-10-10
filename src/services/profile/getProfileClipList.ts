import { privateApi } from '..';
import { MyProfileClip } from '../../global/interface/profile';
import { CLIP_LIST_PATH, PROFILE_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetMyProfileClipListRsp {
  cursorId: string;
  myClipRspList: MyProfileClip[];
}

export const getMyProfileClipList = (
  cursorId: string,
): Promise<GetMyProfileClipListRsp> => {
  return privateApi
    .get(`${PROFILE_LIST_PATH}${CLIP_LIST_PATH}?${CURSOR_PARAM}=${cursorId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
