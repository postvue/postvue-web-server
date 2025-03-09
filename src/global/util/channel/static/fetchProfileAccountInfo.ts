import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_ACCOUNT_INFO } from 'const/QueryClientConst';
import { ProfileInfo } from 'global/interface/profile';
import { getProfileInfo } from 'services/profile/getProfileInfo';

export async function fetchProfileAccountInfo(
  username: string,
): Promise<ProfileInfo> {
  const profileInfo = await getProfileInfo(username);

  queryClient.setQueryData(
    [QUERY_STATE_PROFILE_ACCOUNT_INFO, username],
    profileInfo,
  );

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_ACCOUNT_INFO, username],
    data: profileInfo,
  } as StateIMessage);

  return profileInfo;
}
