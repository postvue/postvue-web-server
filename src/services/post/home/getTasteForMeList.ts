import { CURSOR_PARAM } from 'services/appApiQueryParam';
import { api, optAuthApi } from '../..';
import { TASTE_FOR_ME_PATH } from '../../../const/PathConst';
import { PostRsp } from '../../../global/interface/post';
import { POST_LIST_PATH } from '../../appApiPath';

interface GetTasteForMeListRsp {
  cursorId: string;
  snsPostRspList: PostRsp[];
}

export const getTasteForMeListByParam = (
  cursorId: string,
  page: number,
): Promise<GetTasteForMeListRsp> => {
  return optAuthApi
    .get(
      `${POST_LIST_PATH}${TASTE_FOR_ME_PATH}?${CURSOR_PARAM}=${cursorId}&page=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getTasteForMeList = (): Promise<PostRsp[]> => {
  return api
    .get(`${POST_LIST_PATH}${TASTE_FOR_ME_PATH}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
