import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from 'App';
import { AxiosError } from 'axios';
import { QUERY_STATE_POST_COMMENT_LIST } from 'const/QueryClientConst';
import { PostComment } from 'global/interface/post';
import { convertQueryTemplate } from 'global/util/TemplateUtil';
import { createPostComment } from 'services/post/createPostComment';
import { GetPostCommentsRsp } from 'services/post/getPostComments';
import { PostCommetListInfiniteInterface } from './QueryStatePostCommentListInfinite';

export const QueryMutationCreatePostComment = (): UseMutationResult<
  PostComment,
  AxiosError,
  { postId: string; formData: FormData }
> => {
  return useMutation({
    mutationKey: [QUERY_STATE_POST_COMMENT_LIST],
    mutationFn: ({ postId, formData }) => createPostComment(postId, formData),
    onSuccess(data, variables) {
      queryClient.setQueryData(
        [convertQueryTemplate(QUERY_STATE_POST_COMMENT_LIST, variables.postId)],
        (oldData: PostCommetListInfiniteInterface) => {
          if (!oldData) {
            return oldData;
          }
          const updatedPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              // 첫 번째 페이지에 새로운 아이템을 추가
              return {
                ...page,
                snsPostCommentRspList: [data, ...page.snsPostCommentRspList], // 맨 앞에 새로운 아이템 추가
              } as GetPostCommentsRsp;
            }
            return page;
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
