import { queryClient } from 'App';
import {
  QUERY_STATE_POST_SCRAP_PREVIEW_LIST,
  QUERY_STATE_PROFILE_ACCOUNT_POST_LIST,
  QUERY_STATE_PROFILE_CLIP_LIST,
  QUERY_STATE_PROFILE_SCRAP_LIST,
} from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { ProfileClipListQueryInterface } from 'hook/queryhook/QueryStateProfileClipListInfinite';
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
    queryClient.setQueryData(
      [QUERY_STATE_PROFILE_CLIP_LIST],
      (oldData: ProfileClipListQueryInterface) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            // 삭제할 댓글을 제외한 새로운 리스트를 반환
            const updatedProfileClipList = { ...page.snsPostRspList };
            updatedProfileClipList.push(snsPost);

            return {
              ...page,
              myClipRspList: updatedProfileClipList,
            };
          }),
        };
      },
    );
  } else {
    queryClient.setQueryData(
      [QUERY_STATE_PROFILE_CLIP_LIST],
      (oldData: ProfileClipListQueryInterface) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            // 삭제할 댓글을 제외한 새로운 리스트를 반환
            const updatedProfileClipList = page.snsPostRspList.filter(
              (value) => value.postId !== postId,
            );

            return {
              ...page,
              myClipRspList: updatedProfileClipList,
            };
          }),
        };
      },
    );
  }

  queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_POST_SCRAP_PREVIEW_LIST, postId],
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST],
  });
};
