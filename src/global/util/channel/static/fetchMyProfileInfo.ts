import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_MY_PROFILE_INFO } from 'const/QueryClientConst';
import { ProfileMyInfo } from 'global/interface/profile';
import { getMyProfileInfo } from 'services/profile/getMyProfileInfo';

export async function fetchMyProfileInfo(): Promise<ProfileMyInfo> {
  const myProfileInfo = await getMyProfileInfo(true);

  queryClient.setQueryData([QUERY_STATE_MY_PROFILE_INFO], myProfileInfo);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_MY_PROFILE_INFO],
    data: myProfileInfo,
  } as StateIMessage);

  return myProfileInfo;
}
