import { CreateProfileReportReq } from 'global/interface/profile';
import { privateApi } from '..';

import { PROFILE_LIST_PATH, REPORT_PATH } from '../appApiPath';

export const createProfileAccountReport = (
  userId: string,
  createProfileReportReq: CreateProfileReportReq,
): Promise<boolean> => {
  return privateApi
    .post(
      `${PROFILE_LIST_PATH}${REPORT_PATH}/${userId}`,
      createProfileReportReq,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
