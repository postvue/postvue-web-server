import { queryClient } from 'App';
import { INIT_CURSOR_ID, PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_TASTE_FOR_ME_LIST } from 'const/QueryClientConst';
import { TasteForMeListQueryInterface } from 'hook/queryhook/QueryStateTasteForMeListInfinite';
import { GetTasteForMeListRsp } from 'services/post/home/getFollowForMeList';
import { getTasteForMeListByParam } from 'services/post/home/getTasteForMeList';

export async function fetchTasteForMeByNotChannel(): Promise<GetTasteForMeListRsp> {
  const tasteForMeList = await getTasteForMeListByParam(
    INIT_CURSOR_ID,
    PAGE_NUM,
  );

  const fetchData: TasteForMeListQueryInterface = {
    pageParams: [{ cursorId: INIT_CURSOR_ID, pageNum: PAGE_NUM }],
    pages: [{ ...tasteForMeList }],
  };

  queryClient.setQueryData([QUERY_STATE_TASTE_FOR_ME_LIST], fetchData);

  return tasteForMeList;
}
