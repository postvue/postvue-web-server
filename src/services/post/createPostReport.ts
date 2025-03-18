import { privateApi } from '..';
import { CreatePostReportReq } from '../../global/interface/post';

import { POST_LIST_PATH, REPORT_PATH } from '../appApiPath';

export const createPostReport = (
  postId: string,
  createPostReportReq: CreatePostReportReq,
): Promise<boolean> => {
  return privateApi
    .post(`${POST_LIST_PATH}/${postId}${REPORT_PATH}`, createPostReportReq)
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
