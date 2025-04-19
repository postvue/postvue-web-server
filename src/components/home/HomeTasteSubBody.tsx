import React from 'react';

import SnsPostVirtualMasonryLayout from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
import { QueryStateTasteForMeListInfinite } from 'hook/queryhook/QueryStateTasteForMeListInfinite';
import TasteForMeListInfiniteScroll from 'hook/TasteForMeListInfiniteScroll';
import styled from 'styled-components';

interface HomeTasteSubBody {
  scrollElement?: Element | undefined;
}

const HomeTasteSubBody: React.FC<HomeTasteSubBody> = ({ scrollElement }) => {
  const { data: tasteForMeList, isFetched: isFetchedByTasteForMeList } =
    QueryStateTasteForMeListInfinite();

  return (
    <>
      {isFetchedByTasteForMeList && tasteForMeList && (
        <HomeBodyContainer>
          <div>
            {/* <SnsPostMasonryLayout
              snsPostList={tasteForMeList.pages.flatMap(
                (v) => v.snsPostRspList,
              )}
              searchType="recomm"
              fixNum={2}
            /> */}
            {/* <TasteForMeListInfiniteScroll /> */}

            <SnsPostVirtualMasonryLayout
              snsPostList={tasteForMeList.pages.flatMap(
                (v) => v.snsPostRspList,
              )}
              searchType="recomm"
              scrollElement={scrollElement}
              inViewElement={<TasteForMeListInfiniteScroll />}
            />
          </div>
        </HomeBodyContainer>
      )}
    </>
  );
};

const HomeBodyContainer = styled.div`
  padding-top: 10px;
`;

export default HomeTasteSubBody;
