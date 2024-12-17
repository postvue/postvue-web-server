import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import {
  COMMENT_DOWN_ANIMATION,
  COMMENT_UP_ANIMATION,
} from 'const/PostCommentConst';
import { QUERY_STATE_POST_COMMENT_LIST } from 'const/QueryClientConst';
import { PostLikeRsp } from 'global/interface/post';
import { animateCount, AnimationDirection } from 'global/util/commentUtil';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { putPostCommentLike } from 'services/post/putPostCommentLike';
import { PostCommetListInfiniteInterface } from './QueryStatePostCommentListInfinite';

export const QueryMutationPutPostCommentLike = (): UseMutationResult<
  PostLikeRsp,
  AxiosError,
  {
    postId: string;
    commentId: string;
    likeCountRef: React.MutableRefObject<{
      [key: string]: HTMLDivElement | null;
    }>;
  }
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_POST_COMMENT_LIST],
    mutationFn: ({ postId, commentId }) =>
      putPostCommentLike(postId, commentId),
    onSuccess(data, variables) {
      queryClient.setQueryData(
        [convertQueryTemplate(QUERY_STATE_POST_COMMENT_LIST, variables.postId)],
        (oldData: PostCommetListInfiniteInterface) => {
          if (!oldData) {
            return oldData;
          }

          const updatedPages = oldData.pages.map((page) => {
            const updatedComments = page.snsPostCommentRspList.map(
              (postComment) => {
                if (postComment.postCommentId === variables.commentId) {
                  let animation: AnimationDirection;
                  const updatedComment = { ...postComment }; // 참조 변경

                  if (data.isLike) {
                    updatedComment.likeCount += 1;
                    updatedComment.isLiked = true;
                    animation = COMMENT_UP_ANIMATION;
                  } else {
                    updatedComment.likeCount -= 1;
                    updatedComment.isLiked = false;
                    animation = COMMENT_DOWN_ANIMATION;
                  }

                  animateCount(
                    variables.likeCountRef.current[
                      updatedComment.postCommentId
                    ],
                    updatedComment.likeCount,
                    animation,
                  );

                  return updatedComment; // 참조 변경된 객체 반환
                }

                return postComment;
              },
            );

            return {
              ...page,
              snsPostCommentRspList: updatedComments,
            };
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        },
      );
    },
  });
};
