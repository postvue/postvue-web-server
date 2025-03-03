import {
  END_DATE_PARAM,
  LATITUDE_PARAM,
  LONGITUDE_PARAM,
  PAGE_PARAM,
  SEARCH_QUERY_PARAM,
  START_DATE_PARAM,
} from 'services/appApiQueryParam';
import { optAuthApi } from '..';
import { PostRsp } from '../../global/interface/post';
import { POST_MAP_POST_API_PATH } from '../appApiPath';

export const getPostMapPostBySrchQry = (
  srchQry: string,
  page: number,
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
): Promise<PostRsp[]> => {
  return optAuthApi
    .get(
      `${POST_MAP_POST_API_PATH}?${SEARCH_QUERY_PARAM}=${srchQry}&${PAGE_PARAM}=${page}&${LATITUDE_PARAM}=${latitude}&${LONGITUDE_PARAM}=${longitude}&${START_DATE_PARAM}=${encodeURIComponent(startDate)}&${END_DATE_PARAM}=${encodeURIComponent(endDate)}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
