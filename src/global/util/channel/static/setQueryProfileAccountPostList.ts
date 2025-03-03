import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_ACCOUNT_POST_LIST } from 'const/QueryClientConst';
import { PostRsp } from 'global/interface/post';
import { ProfilePostListQueryInterface } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { GetProfilePostListRsp } from 'services/profile/getProfilePostList';

export async function setQueryProfileAccountPostList(
  snsPost: PostRsp,
): Promise<void> {
  const data: ProfilePostListQueryInterface | undefined =
    queryClient.getQueryData([QUERY_STATE_PROFILE_ACCOUNT_POST_LIST]);

  if (!data) return;

  const updatedClip = data.pages.map((page, index) => {
    // 삭제할 댓글을 제외한 새로운 리스트를 반환
    if (index !== 0) return page;

    const updatedProfileAccountPostList = page.snsPostRspList;
    updatedProfileAccountPostList.unshift(snsPost);

    const date: GetProfilePostListRsp = {
      ...page,
      snsPostRspList: updatedProfileAccountPostList,
    } as GetProfilePostListRsp;

    return date;
  });

  const updatedData: ProfilePostListQueryInterface = {
    ...data,
    pages: updatedClip,
  };

  await queryClient.setQueryData(
    [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST],
    updatedData,
  );

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_ACCOUNT_POST_LIST],
    data: updatedData,
  } as StateIMessage);
}
