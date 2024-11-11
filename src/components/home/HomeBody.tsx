import React from 'react';
import { useRecoilValue } from 'recoil';
import { TASTE_FOR_ME_TAB_ID } from '../../const/TabConfigConst';
import { MasonryPostRsp } from '../../global/interface/post';
import TasteForMeInfiniteScroll from '../../hook/TasteForMeInfiniteScroll';

import { homeTabIdAtom } from '../../states/HomePageAtom';

import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import FollowForMeListInfiniteScroll from 'hook/FollowForMeListInfiniteScroll';
import { QueryStateFollowForMeListInfinite } from 'hook/queryhook/QueryStateFollowForMeListInfinite';
import styled from 'styled-components';
import { tasteForMeHashMapAtom } from '../../states/TasteForMeAtom';
import HomeFollowSubBody from './body/HomeFollowSubBody';

const HomeBody: React.FC = () => {
  const mainTabId = useRecoilValue(homeTabIdAtom);

  const snsPostRspHashMapByTaste = useRecoilValue(tasteForMeHashMapAtom);
  const { data: followForMeList, isFetched: isFetchedByFollowForMe } =
    QueryStateFollowForMeListInfinite();

  followForMeList?.pages.flatMap((v) =>
    v.snsPostRspList.map((value) => {
      const postContent = value.postContents[0];

      const homePostRsp: MasonryPostRsp = {
        postId: value.postId,
        userId: value.userId,
        postContent: postContent.content,
        postContentType: postContent.postContentType,
        username: value.username,
        location: value.location,
      };

      return homePostRsp;
    }),
  );

  return (
    <HomeBodyContainer>
      {mainTabId === TASTE_FOR_ME_TAB_ID ? (
        <>
          <SnsPostMasonryLayout
            snsPostList={Array.from(snsPostRspHashMapByTaste.entries()).map(
              ([, v]) => v,
            )}
          />
          <TasteForMeInfiniteScroll />
        </>
      ) : (
        <>
          {isFetchedByFollowForMe && (
            <>
              {followForMeList ? (
                <>
                  <SnsPostMasonryLayout
                    snsPostList={followForMeList?.pages.flatMap((v) =>
                      v.snsPostRspList.map((value) => value),
                    )}
                  />
                  <FollowForMeListInfiniteScroll />
                </>
              ) : (
                <HomeFollowSubBody />
              )}
            </>
          )}
        </>
      )}
    </HomeBodyContainer>
  );
};

const HomeBodyContainer = styled.div`
  padding-top: 10px;
`;

export default HomeBody;
