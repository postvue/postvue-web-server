import React from 'react';

import { queryClient } from 'App';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { INIT_CURSOR_ID, PAGE_NUM } from 'const/PageConfigConst';
import { QUERY_STATE_TASTE_FOR_ME_LIST } from 'const/QueryClientConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { TasteForMeListQueryInterface } from 'hook/queryhook/QueryStateTasteForMeListInfinite';
import { getTasteForMeListByParam } from 'services/post/home/getTasteForMeList';
import HomeTasteSubBody from './HomeTasteSubBody';

const HomeTasteBody: React.FC = () => {
  const { windowWidth } = useWindowSize();

  return (
    <div>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <PullToRefreshComponent
          onRefresh={async () => {
            // queryClient.setQueryData([QUERY_STATE_TASTE_FOR_ME_LIST], undefined); // 기존 데이터 초기화
            // refetchByTasteForMeList();
            // queryClient.setQueryData([QUERY_STATE_TASTE_FOR_ME_LIST], undefined);
            // queryClient.invalidateQueries({
            //   queryKey: [QUERY_STATE_TASTE_FOR_ME_LIST],
            // }); // 기존 데이터 완전 삭제
            // fetchNextPage();
            // refetchByTasteForMeList();

            const tasteForMeList = await getTasteForMeListByParam(
              INIT_CURSOR_ID,
              PAGE_NUM,
            );

            const fetchData: TasteForMeListQueryInterface = {
              pageParams: [{ cursorId: INIT_CURSOR_ID, pageNum: PAGE_NUM }],
              pages: [{ ...tasteForMeList }],
            };

            queryClient.setQueryData(
              [QUERY_STATE_TASTE_FOR_ME_LIST],
              fetchData,
            );
          }}
        >
          <HomeTasteSubBody />
        </PullToRefreshComponent>
      ) : (
        <HomeTasteSubBody />
      )}
    </div>
  );
};

export default HomeTasteBody;
