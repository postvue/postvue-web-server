import { optAuthApi } from '..';
import { PostComment } from '../../global/interface/post';
import { POST_LIST_PATH, REPLY_LIST_PATH } from '../appApiPath';

export const getPostReplyReplies = (
  postId: string,
  replyCommentId: string,
): Promise<PostComment[]> => {
  return optAuthApi
    .get(
      `${POST_LIST_PATH}/${postId}${REPLY_LIST_PATH}/${replyCommentId}${REPLY_LIST_PATH}`,
    )
    .then((res) => {
      console.log(res.data);
      return res.data.data;
    })
    .catch((error) => {
      throw error;
    });
};
