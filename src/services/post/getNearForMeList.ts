import {
  END_DATE_PARAM,
  FILTER_PARAM,
  PAGE_PARAM,
  START_DATE_PARAM,
} from 'services/appApiQueryParam';
import { optAuthApi } from '..';
import { PostRsp } from '../../global/interface/post';
import { NEAR_FOR_ME_API_PATH } from '../appApiPath';

export const getNearForMeList = (
  page: number,
  latitude: number,
  longitude: number,
  nearFilter: string,
  startDate: string,
  endDate: string,
): Promise<PostRsp[]> => {
  return optAuthApi
    .get(
      `${NEAR_FOR_ME_API_PATH}?${PAGE_PARAM}=${page}&lat=${latitude}&lon=${longitude}&${FILTER_PARAM}=${nearFilter}&${START_DATE_PARAM}=${encodeURIComponent(startDate)}&${END_DATE_PARAM}=${encodeURIComponent(endDate)}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
