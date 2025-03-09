import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { QUERY_STATE_PROFILE_SCRAP_INFO } from 'const/QueryClientConst';
import {
  getProfileScrapInfo,
  GetProfileScrapInfoRsp,
} from 'services/profile/getProfileScrapInfo';

export const fetchScrapInfo = async (
  scrapId: string,
): Promise<GetProfileScrapInfoRsp> => {
  const profileScrapInfo = await getProfileScrapInfo(scrapId);

  queryClient.setQueryData(
    [QUERY_STATE_PROFILE_SCRAP_INFO, scrapId],
    profileScrapInfo,
  );

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_SCRAP_INFO, scrapId],
    data: profileScrapInfo,
  } as StateIMessage);

  return profileScrapInfo;
};
