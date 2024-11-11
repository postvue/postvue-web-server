import { FILTER_PARAM, PAGE_PARAM } from 'services/appApiQueryParam';
import { api } from '../..';
import { PostRsp } from '../../../global/interface/post';
import { POST_LIST_PATH } from '../../appApiPath';

export const getNearForMeList = (
  page: number,
  latitude: number,
  longitude: number,
  nearFilter: string,
): Promise<PostRsp[]> => {
  return api
    .get(
      `${POST_LIST_PATH}/near_for_me?${PAGE_PARAM}=${page}&lat=${latitude}&lon=${longitude}&${FILTER_PARAM}=${nearFilter}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
