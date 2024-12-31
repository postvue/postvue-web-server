import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_CLIP_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { ProfileClipListQueryInterface } from 'hook/queryhook/QueryStateProfileClipListInfinite';
import { GetMyProfileClipListRsp } from 'services/profile/getProfileClipList';

export async function setQueryProfileClipList(snsPost: PostRsp): Promise<void> {
  const data: ProfileClipListQueryInterface | undefined =
    queryClient.getQueryData([QUERY_STATE_PROFILE_CLIP_LIST]);

  if (!data) return;

  const updatedClip = data.pages.map((page, index) => {
    // 삭제할 댓글을 제외한 새로운 리스트를 반환
    if (index !== 0) return page;
    const updatedProfileClipList = page.snsPostRspList;
    updatedProfileClipList.unshift(snsPost);

    const date: GetMyProfileClipListRsp = {
      ...page,
      snsPostRspList: updatedProfileClipList,
    };

    return date;
  });

  const updatedData: ProfileClipListQueryInterface = {
    ...data,
    pages: updatedClip,
  };

  await queryClient.setQueryData([QUERY_STATE_PROFILE_CLIP_LIST], updatedData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_CLIP_LIST],
    data: updatedData,
  } as StateIMessage);
}

export async function setQueryRemoveProfileClipList(
  postId: string,
): Promise<void> {
  const data: ProfileClipListQueryInterface | undefined =
    queryClient.getQueryData([QUERY_STATE_PROFILE_CLIP_LIST]);
  if (!data) return;

  const updatedClip = data.pages.map((page) => {
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

  const updatedData: ProfileClipListQueryInterface = {
    ...data,
    pages: updatedClip,
  };

  await queryClient.setQueryData([QUERY_STATE_PROFILE_CLIP_LIST], updatedData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_CLIP_LIST],
    data: updatedData,
  } as StateIMessage);
}
