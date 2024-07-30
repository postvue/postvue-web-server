import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_API_PATH } from '../appApiPath';

interface GetTasteForMeListRsp {
  cursorId: number;
  snsPostRspList: PostRsp[];
}

export const getTasteForMeListByParam = (
  cursorId: number,
  page: number,
): Promise<GetTasteForMeListRsp> => {
  return api
    .get(`${POST_API_PATH}/taste_for_me?cursorId=${cursorId}&page=${page}`)
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
    .get(`${POST_API_PATH}/taste_for_me`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
