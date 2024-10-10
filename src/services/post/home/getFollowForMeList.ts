import { CURSOR_PARAM } from 'services/appApiQueryParam';
import { api, optAuthApi } from '../..';
import { FOLLOW_FOR_ME_PATH } from '../../../const/PathConst';
import { PostRsp } from '../../../global/interface/post';
import { POST_LIST_PATH } from '../../appApiPath';

interface GetTasteForMeListRsp {
  cursorId: string;
  snsPostRspList: PostRsp[];
}

export const getFollowForMeListByParam = (
  cursorId: string,
): Promise<GetTasteForMeListRsp> => {
  return optAuthApi
    .get(`${POST_LIST_PATH}${FOLLOW_FOR_ME_PATH}?${CURSOR_PARAM}=${cursorId}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getFollowForMeList = (): Promise<PostRsp[]> => {
  return api
    .get(`${POST_LIST_PATH}${FOLLOW_FOR_ME_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
