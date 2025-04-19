import React from 'react';

import FollowForMeListInfiniteScroll from 'hook/FollowForMeListInfiniteScroll';
import {
  FollowForMeListQueryInterface,
  QueryStateFollowForMeListInfinite,
} from 'hook/queryhook/QueryStateFollowForMeListInfinite';

import { queryClient } from 'App';
import SnsPostVirtualMasonryLayout from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
import PullToRefreshComponent from 'components/PullToRefreshComponent';
import { INIT_CURSOR_ID } from 'const/PageConfigConst';
import { QUERY_STATE_FOLLOW_FOR_ME_LIST } from 'const/QueryClientConst';
import { getFollowForMeListByParam } from 'services/post/home/getFollowForMeList';
import styled from 'styled-components';
import HomeFollowSubBody from './body/HomeFollowSubBody';

interface HomeFollowBodyProps {
  scrollElement?: Element | undefined;
}

const HomeFolowBody: React.FC<HomeFollowBodyProps> = ({ scrollElement }) => {
  const {
    data: followForMeList,
    isFetched: isFetchedByFollowForMe,
    isLoading,
  } = QueryStateFollowForMeListInfinite();

  return (
    <div>
      <PullToRefreshComponent
        onRefresh={async () => {
          const fetchData = await getFollowForMeListByParam(INIT_CURSOR_ID);

          const data: FollowForMeListQueryInterface = {
            pageParams: [INIT_CURSOR_ID],
            pages: [{ ...fetchData }],
          };

          queryClient.setQueryData([QUERY_STATE_FOLLOW_FOR_ME_LIST], data);
        }}
      >
        <HomeBodyContainer>
          <div>
            {isFetchedByFollowForMe && !isLoading && (
              <>
                {followForMeList &&
                followForMeList.pages.flatMap((value) => value.snsPostRspList)
                  .length > 0 ? (
                  <>
                    {/* <SnsPostMasonryLayout
                      snsPostList={followForMeList?.pages.flatMap((v) =>
                        v.snsPostRspList.map((value) => value),
                      )}
                    />
                    <FollowForMeListInfiniteScroll /> */}
                    <SnsPostVirtualMasonryLayout
                      snsPostList={followForMeList?.pages.flatMap((v) =>
                        v.snsPostRspList.map((value) => value),
                      )}
                      inViewElement={<FollowForMeListInfiniteScroll />}
                      scrollElement={scrollElement}
                    />
                  </>
                ) : (
                  <HomeFollowSubBody />
                )}
              </>
            )}
          </div>
        </HomeBodyContainer>
      </PullToRefreshComponent>
    </div>
  );
};

const HomeBodyContainer = styled.div`
  padding-top: 10px;
`;

export default HomeFolowBody;
