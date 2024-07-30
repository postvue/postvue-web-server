import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_API_PATH } from '../appApiPath';

interface GetTasteForMeListRsp {
  cursorId: number;
  snsPostRspList: PostRsp[];
}

export const getFollowForMeListByParam = (
  cursorId: number,
): Promise<GetTasteForMeListRsp> => {
  return api
    .get(`${POST_API_PATH}/follow_for_me?cursorId=${cursorId}`)
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
    .get(`${POST_API_PATH}/follow_for_me`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
