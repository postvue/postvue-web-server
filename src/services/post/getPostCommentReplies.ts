import { optAuthApi } from '..';
import { PostComment } from '../../global/interface/post';
import {
  COMMENT_LIST_PATH,
  POST_LIST_PATH,
  REPLY_LIST_PATH,
} from '../appApiPath';
import { CURSOR_PARAM } from '../appApiQueryParam';

export interface GetPostCommentReplyListRsp {
  cursorId: string;
  snsPostCommentRspList: PostComment[];
}

export const getPostCommentReplies = (
  postId: string,
  commentId: string,
  cursorId: string,
): Promise<GetPostCommentReplyListRsp> => {
  return optAuthApi
    .get(
      `${POST_LIST_PATH}/${postId}${COMMENT_LIST_PATH}/${commentId}${REPLY_LIST_PATH}?${CURSOR_PARAM}=${cursorId}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
