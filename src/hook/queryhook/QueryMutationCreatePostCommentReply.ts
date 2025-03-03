import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { COMMENT_UP_ANIMATION } from 'const/PostCommentConst';
import {
  QUERY_STATE_POST_COMMENT_LIST,
  QUERY_STATE_POST_COMMENT_REPLY_LIST,
} from 'const/QueryClientConst';
import { PostComment } from 'global/interface/post';
import { animateCount } from 'global/util/CommentUtil';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { createPostCommentReply } from 'services/post/createPostCommentReply';
import { GetPostCommentsRsp } from 'services/post/getPostComments';
import { PostCommetListInfiniteInterface } from './QueryStatePostCommentListInfinite';

export const QueryMutationCreatePostCommentReply = (): UseMutationResult<
  PostComment,
  AxiosError,
  {
    postId: string;
    replyCommentId: string;
    commentId: string;
    isReplyToCommentByThreadMsg: boolean;
    formData: FormData;
    commentReplyCountRef: React.MutableRefObject<{
      [key: string]: HTMLDivElement | null;
    }>;
  }
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_POST_COMMENT_LIST],
    mutationFn: ({
      postId,
      commentId,
      isReplyToCommentByThreadMsg,
      formData,
    }) =>
      createPostCommentReply(
        postId,
        commentId,
        isReplyToCommentByThreadMsg,
        formData,
      ),
    onSuccess(data, variables) {
      queryClient.setQueryData(
        [
          convertQueryTemplate(
            QUERY_STATE_POST_COMMENT_REPLY_LIST,
            variables.replyCommentId,
          ),
        ],
        (oldData: PostCommetListInfiniteInterface) => {
          if (!oldData) {
            return oldData;
          }

          const updatedPostCommentListByCommentCount = oldData.pages.map(
            (page) => {
              const temp = [...page.snsPostCommentRspList];
              temp.forEach((postComment) => {
                if (postComment.postCommentId === variables.commentId) {
                  postComment.commentCount += 1;
                  animateCount(
                    variables.commentReplyCountRef.current[
                      postComment.postCommentId
                    ],
                    postComment.commentCount,
                    COMMENT_UP_ANIMATION,
                  );
                }
              });

              return {
                ...page,
                snsPostCommentRspList: temp,
              } as GetPostCommentsRsp;
            },
          );

          const updatedPages = updatedPostCommentListByCommentCount.map(
            (page, index) => {
              if (index === 0) {
                // 첫 번째 페이지에 새로운 아이템을 추가
                return {
                  ...page,
                  snsPostCommentRspList: [...page.snsPostCommentRspList, data], // 맨 앞에 새로운 아이템 추가
                } as GetPostCommentsRsp;
              }
              return page;
            },
          );

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );
    },
  });
};
