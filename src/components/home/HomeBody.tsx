import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MasonryPostRsp } from '../../global/interface/post';
import TasteForMeInfiniteScroll from '../../hook/TasteForMeInfiniteScroll';

import {
  homeScrollPositionInfoAtom,
  homeTabIdAtom,
} from '../../states/HomePageAtom';

import SnsPostMasonryLayout_ from 'components/layouts/SnsPostMasonryLayout_';
import { TASTE_FOR_ME_TAB_ID } from 'const/TabConfigConst';
import FollowForMeListInfiniteScroll from 'hook/FollowForMeListInfiniteScroll';
import { QueryStateFollowForMeListInfinite } from 'hook/queryhook/QueryStateFollowForMeListInfinite';
import styled from 'styled-components';
import { tasteForMeHashMapAtom } from '../../states/TasteForMeAtom';
import HomeFollowSubBody from './body/HomeFollowSubBody';

const HomeBody: React.FC = () => {
  const [mainTabId, setMainTabId] = useRecoilState(homeTabIdAtom);

  const snsPostRspHashMapByTaste = useRecoilValue(tasteForMeHashMapAtom);

  const [homeScrollPositionInfo, setHomeScrollPositionInfo] = useRecoilState(
    homeScrollPositionInfoAtom,
  );
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
        previewImg: postContent.previewImg,
        videoDuration: postContent.videoDuration,
        isUploaded: postContent.isUploaded,
      };

      return homePostRsp;
    }),
  );

  return (
    <HomeBodyContainer>
      {/* <ViewPagerLayout
        tabId={mainTabId}
        setTabId={setMainTabId}
        tabScrollInfoList={homeScrollPositionInfo}
        setTabScrollInfoList={setHomeScrollPositionInfo}
      >
        <div>
          <SnsPostMasonryLayout_
            snsPostList={Array.from(snsPostRspHashMapByTaste.entries()).map(
              ([, v]) => v,
            )}
          />
          <TasteForMeInfiniteScroll />
        </div>
        <div>
          {isFetchedByFollowForMe && (
            <>
              {followForMeList &&
              followForMeList.pages.flatMap((value) => value.snsPostRspList)
                .length > 0 ? (
                <>
                  <SnsPostMasonryLayout_
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
        </div>
      </ViewPagerLayout> */}
      <>
        {/* {mainTabId === TASTE_FOR_ME_TAB_ID ? (
          <TasteForMeInfiniteScroll />
        ) : (
          <>
            {isFetchedByFollowForMe && (
              <>
                {followForMeList &&
                  followForMeList.pages.flatMap((value) => value.snsPostRspList)
                    .length > 0 && <FollowForMeListInfiniteScroll />}
              </>
            )}
          </>
        )} */}
      </>
      <>
        {mainTabId === TASTE_FOR_ME_TAB_ID ? (
          <div>
            <SnsPostMasonryLayout_
              snsPostList={Array.from(snsPostRspHashMapByTaste.entries()).map(
                ([, v]) => v,
              )}
            />
            <TasteForMeInfiniteScroll />
          </div>
        ) : (
          <div>
            {isFetchedByFollowForMe && (
              <>
                {followForMeList &&
                followForMeList.pages.flatMap((value) => value.snsPostRspList)
                  .length > 0 ? (
                  <>
                    <SnsPostMasonryLayout_
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
          </div>
        )}
      </>
    </HomeBodyContainer>
  );
};

const HomeBodyContainer = styled.div`
  padding-top: 10px;
`;

export default HomeBody;
