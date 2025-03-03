import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_CLIP_LIST } from 'const/QueryClientConst';
import { getMyProfileClipList } from 'services/profile/getProfileClipList';
import 'swiper/css';

export async function fetchProfileClipListInfinite(): Promise<any> {
  // 프로필 계정 페이지 내 상태 변경

  const profileClipList = await getMyProfileClipList(INIT_CURSOR_ID);
  const tempUpdatedData = {
    pages: [profileClipList],
    pageParams: [INIT_CURSOR_ID],
  };

  queryClient.setQueryData([QUERY_STATE_PROFILE_CLIP_LIST], tempUpdatedData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_CLIP_LIST],
    data: tempUpdatedData,
  } as StateIMessage);
}
