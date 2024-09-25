import { CURSOR_PARAM } from 'services/appApiQueryParam';
import { api } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_LIST_PATH } from '../appApiPath';

export const getNearForMeListByCursor = (
  cursor: number,
  latitude: number,
  longitude: number,
): Promise<PostRsp[]> => {
  return api
    .get(
      `${POST_LIST_PATH}/near_for_me?${CURSOR_PARAM}=${cursor}&lat=${latitude}&lon=${longitude}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getNearForMeList = (
  latitude: number,
  longitude: number,
): Promise<PostRsp[]> => {
  return api
    .get(`${POST_LIST_PATH}/near_for_me?lat=${latitude}&lon=${longitude}`)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
