import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_CLIP_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { ProfileClipListQueryInterface } from 'hook/queryhook/QueryStateProfileClipListInfinite';
import {
  getMyProfileClipList,
  GetMyProfileClipListRsp,
} from 'services/profile/getProfileClipList';
import 'swiper/css';

export async function setQueryOrFetchProfileClipListInfinite(
  postId: string,
  isClipped: boolean,
  snsPost: PostRsp,
): Promise<any> {
  // 프로필 계정 페이지 내 상태 변경
  const updatedData: ProfileClipListQueryInterface | undefined =
    queryClient.getQueryData([QUERY_STATE_PROFILE_CLIP_LIST]);

  let tempUpdatedData: ProfileClipListQueryInterface;
  if (updatedData) {
    tempUpdatedData = { ...updatedData };

    if (isClipped) {
      tempUpdatedData.pages = tempUpdatedData.pages.map((page, index) => {
        // 삭제할 댓글을 제외한 새로운 리스트를 반환
        if (index !== 0) return page;
        const updatedProfileClipList = [...page.snsPostRspList];
        updatedProfileClipList.unshift(snsPost);

        const date: GetMyProfileClipListRsp = {
          ...page,
          snsPostRspList: updatedProfileClipList,
        };

        return date;
      });
    } else {
      tempUpdatedData.pages = tempUpdatedData.pages.map((page) => {
        // 삭제할 댓글을 제외한 새로운 리스트를 반환
        const updatedProfileClipList = page.snsPostRspList.filter(
          (value) => value.postId !== postId,
        );

        const date: GetMyProfileClipListRsp = {
          ...page,
          snsPostRspList: updatedProfileClipList,
        };

        return date;
      });
    }
  } else {
    const profileClipList = await getMyProfileClipList(INIT_CURSOR_ID);
    tempUpdatedData = {
      pages: [profileClipList],
      pageParams: [INIT_CURSOR_ID],
    };
  }
  queryClient.setQueryData([QUERY_STATE_PROFILE_CLIP_LIST], tempUpdatedData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_CLIP_LIST],
    data: tempUpdatedData,
  } as StateIMessage);
}
