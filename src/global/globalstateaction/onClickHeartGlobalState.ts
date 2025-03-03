import { queryClient } from 'App';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';

export const onClickHeartGlobalState = (
  username: string,
  postId: string,
  isLiked: boolean,
): void => {
  // 프로필 계정 페이지 내 상태 변경
  // 프로필 계정 페이지 내 상태 변경
  queryClient.setQueryData(
    [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST, username],
    (oldData: ProfilePostListQueryInterface) => {
      if (!oldData) {
        return oldData;
      }
      return {
        ...oldData,
        pages: oldData.pages.map((page) => {
          // 삭제할 댓글을 제외한 새로운 리스트를 반환
          const updatedSnsPostRspList = page.snsPostRspList.map(
            (snsPostRsp) => {
              if (snsPostRsp.postId === postId) {
                return { ...snsPostRsp, isLiked: isLiked };
              } else {
                return snsPostRsp;
              }
            },
          );

          return {
            ...page,
            snsPostRspList: updatedSnsPostRspList,
          };
        }),
      };
    },
  );
};
