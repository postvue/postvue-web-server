import { privateApi } from '..';
import { CreatePostReportReq } from '../../global/interface/post';

import { COMMENT_LIST_PATH, POST_LIST_PATH, REPORT_PATH } from '../appApiPath';

export const createPostCommentReport = (
  postId: string,
  commentId: string,
  createPostReportReq: CreatePostReportReq,
): Promise<boolean> => {
  return privateApi
    .post(
      `${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}/${commentId}${REPORT_PATH}`,
      createPostReportReq,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
