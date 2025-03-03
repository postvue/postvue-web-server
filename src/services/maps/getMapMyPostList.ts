import { PAGE_PARAM } from 'services/appApiQueryParam';
import { privateApi } from '..';
import { PostRsp } from '../../global/interface/post';
import { MAP_MY_POST_PATH } from '../appApiPath';

export const getMapMyPostList = (page: number): Promise<PostRsp[]> => {
  return privateApi
    .get(`${MAP_MY_POST_PATH}?${PAGE_PARAM}=${page}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
