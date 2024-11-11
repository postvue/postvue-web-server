import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { QUERY_STATE_POST_COMMENT_LIST } from 'const/QueryClientConst';
import { DeleteCommentRsp } from 'global/interface/post';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { deletePostComment } from 'services/post/deletePostComment';
import { GetPostCommentsRsp } from 'services/post/getPostComments';
import { PostCommetListInfiniteInterface } from './QueryStatePostCommentListInfinite';

export const QueryMutationDeletePostComment = (): UseMutationResult<
  DeleteCommentRsp,
  AxiosError,
  { commentId: string }
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_POST_COMMENT_LIST],
    mutationFn: ({ commentId }) => deletePostComment(commentId),
    onSuccess(data) {
      queryClient.setQueryData(
        [convertQueryTemplate(QUERY_STATE_POST_COMMENT_LIST, data.postId)],
        (oldData: PostCommetListInfiniteInterface) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              // 삭제할 댓글을 제외한 새로운 리스트를 반환
              const updatedComments = page.snsPostCommentRspList.filter(
                (postComment) => postComment.postCommentId !== data.commentId,
              );

              return {
                ...page,
                snsPostCommentRspList: updatedComments,
              } as GetPostCommentsRsp;
            }),
          };
        },
      );
    },
  });
};
