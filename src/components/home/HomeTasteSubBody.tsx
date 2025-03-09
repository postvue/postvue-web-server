import React from 'react';

import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import { QueryStateTasteForMeListInfinite } from 'hook/queryhook/QueryStateTasteForMeListInfinite';
import TasteForMeListInfiniteScroll from 'hook/TasteForMeListInfiniteScroll';
import styled from 'styled-components';

const HomeTasteSubBody: React.FC = () => {
  const { data: tasteForMeList, isFetched: isFetchedByTasteForMeList } =
    QueryStateTasteForMeListInfinite();

  return (
    <>
      {isFetchedByTasteForMeList && tasteForMeList && (
        <HomeBodyContainer>
          <div>
            <SnsPostMasonryLayout
              snsPostList={tasteForMeList.pages.flatMap(
                (v) => v.snsPostRspList,
              )}
              searchType="recomm"
            />
            <TasteForMeListInfiniteScroll />
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
