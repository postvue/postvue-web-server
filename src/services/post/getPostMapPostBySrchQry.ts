import { PAGE_PARAM, SEARCH_QUERY_PARAM } from 'services/appApiQueryParam';
import { privateApi } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_MAP_POST_API_PATH } from '../appApiPath';

export const getPostMapPostBySrchQry = (
  srchQry: string,
  page: number,
): Promise<PostRsp[]> => {
  return privateApi
    .get(
      `${POST_MAP_POST_API_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}&${PAGE_PARAM}=${page}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
