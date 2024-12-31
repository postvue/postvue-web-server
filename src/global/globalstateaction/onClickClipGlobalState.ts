import { queryClient } from 'App';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { refetchProfileScrapList } from 'global/util/channel/static/refetchProfileScrapList';
import {
  setQueryProfileClipList,
  setQueryRemoveProfileClipList,
} from 'global/util/channel/static/setQueryProfileClipList';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';
import 'swiper/css';

export const onClickClipGlobalState = (
  username: string,
  postId: string,
  isClipped: boolean,
  snsPost: PostRsp,
): void => {
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
                return { ...snsPostRsp, isClipped: isClipped };
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

  if (isClipped) {
    // queryClient.setQueryData(
    //   [QUERY_STATE_PROFILE_CLIP_LIST],
    //   (oldData: ProfileClipListQueryInterface) => {
    //     if (!oldData) {
    //       return oldData;
    //     }
    //     return {
    //       ...oldData,
    //       pages: oldData.pages.map((page, index) => {
    //         // 삭제할 댓글을 제외한 새로운 리스트를 반환
    //         if (index !== 0) return page;
    //         const updatedProfileClipList = [...page.snsPostRspList];
    //         updatedProfileClipList.unshift(snsPost);

    //         const date: GetMyProfileClipListRsp = {
    //           ...page,
    //           snsPostRspList: updatedProfileClipList,
    //         };

    //         return date;
    //       }),
    //     };
    //   },
    // );
    setQueryProfileClipList(snsPost);
  } else {
    // queryClient.setQueryData(
    //   [QUERY_STATE_PROFILE_CLIP_LIST],
    //   (oldData: ProfileClipListQueryInterface) => {
    //     if (!oldData) {
    //       return oldData;
    //     }
    //     return {
    //       ...oldData,
    //       pages: oldData.pages.map((page) => {
    //         // 삭제할 댓글을 제외한 새로운 리스트를 반환
    //         const updatedProfileClipList = page.snsPostRspList.filter(
    //           (value) => value.postId !== postId,
    //         );

    //         const date: GetMyProfileClipListRsp = {
    //           ...page,
    //           snsPostRspList: updatedProfileClipList,
    //         };

    //         return date;
    //       }),
    //     };
    //   },
    // );
    setQueryRemoveProfileClipList(postId);
  }

  refetchProfileScrapList();
};
