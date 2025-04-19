import React from 'react';

import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { fetchTasteForMeByNotChannel } from 'global/util/channel/static/fetchTasteForMeByNotChannel';
import useWindowSize from 'hook/customhook/useWindowSize';
import HomeTasteSubBody from './HomeTasteSubBody';

interface HomeTasteBodyProps {
  scrollElement?: Element | undefined;
}

const HomeTasteBody: React.FC<HomeTasteBodyProps> = ({ scrollElement }) => {
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

            await fetchTasteForMeByNotChannel();
          }}
        >
          <HomeTasteSubBody scrollElement={scrollElement} />
        </PullToRefreshComponent>
      ) : (
        <HomeTasteSubBody />
      )}
    </div>
  );
};

export default HomeTasteBody;
