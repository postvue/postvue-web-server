import { queryClient } from 'App';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { SetterOrUpdater } from 'recoil';

export const onClickHeartGlobalState = (
  username: string,
  postId: string,
  isLiked: boolean,
  snsSystemPostHashMap: Map<string, PostRsp>,
  setSnsSystemPostHashMap: SetterOrUpdater<Map<string, PostRsp>>,
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

  // 시스템 변경 변경
  const newSnsPostHashMap = new Map(snsSystemPostHashMap);
  const snsSysPostHashMapTemp = newSnsPostHashMap.get(postId);
  if (snsSysPostHashMapTemp !== undefined) {
    newSnsPostHashMap.set(postId, {
      ...snsSysPostHashMapTemp,
      isLiked: isLiked,
    });
  }
  setSnsSystemPostHashMap(newSnsPostHashMap);
};
