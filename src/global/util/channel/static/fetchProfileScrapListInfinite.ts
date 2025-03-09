import { queryClient } from 'App';
import {
  QUERY_MESSAGE_TYPES,
  stateChannel,
  StateIMessage,
} from 'config/appconfig/StateChannelConfig';
import { PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_PROFILE_SCRAP_LIST } from 'const/QueryClientConst';
import { ProfileScrapListQueryInterface } from 'hook/queryhook/QueryStateProfileScrapList';
import { getProfileScrapList } from 'services/profile/getProfileScrapList';

export async function fetchProfileScrapListInfinite(): Promise<void> {
  const profileScrapList = await getProfileScrapList(PAGE_NUM);

  const fetchData: ProfileScrapListQueryInterface = {
    pageParams: [PAGE_NUM],
    pages: [[...profileScrapList]],
  };

  queryClient.setQueryData([QUERY_STATE_PROFILE_SCRAP_LIST], fetchData);

  stateChannel.postMessage({
    type: QUERY_MESSAGE_TYPES.SEND_DATA_QUERIES,
    queryKey: [QUERY_STATE_PROFILE_SCRAP_LIST],
    data: fetchData,
  } as StateIMessage);
}
