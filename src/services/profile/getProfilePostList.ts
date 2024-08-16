import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH, PROFILE_LIST_PATH } from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

interface GetProfilePostListRsp {
  cursorId: string;
  snsPostRspList: PostRsp[];
}

export const getProfilePostListByCursor = (
  cursor: string,
): Promise<GetProfilePostListRsp> => {
  return api
    .get(`${PROFILE_LIST_PATH}${POST_LIST_PATH}?${CURSOR_PARAM}=${cursor}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
