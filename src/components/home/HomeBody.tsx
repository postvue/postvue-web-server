import React from 'react';
import { useRecoilValue } from 'recoil';
import { NO_IMAGE_DATA_LINK } from '../../const/DummyDataConst';
import { POST_TEXTFIELD_TYPE } from '../../const/PostContentTypeConst';
import { TASTE_FOR_ME_TAB_ID } from '../../const/TabConfigConst';
import { MasonryPostRsp } from '../../global/interface/post';
import FollowForMeInfiniteScroll from '../../hook/FollowForMeInfiniteScroll';
import TasteForMeInfiniteScroll from '../../hook/TasteForMeInfiniteScroll';

import { homeTabIdAtom } from '../../states/HomePageAtom';

import styled from 'styled-components';
import { followForMeHashMapAtom } from '../../states/FollowForMeAtom';
import { tasteForMeHashMapAtom } from '../../states/TasteForMeAtom';
import MasonryLayout from '../layouts/MasonryLayout';
import HomeFollowSubBody from './body/HomeFollowSubBody';

const HomeBody: React.FC = () => {
  const mainTabId = useRecoilValue(homeTabIdAtom);

  const snsPostRspHashMapByTaste = useRecoilValue(tasteForMeHashMapAtom);
  const snsPostRspHashMapByFollow = useRecoilValue(followForMeHashMapAtom);

  return (
    <HomeBodyContainer>
      {mainTabId === TASTE_FOR_ME_TAB_ID ? (
        <>
          <MasonryLayout
            snsPostUrlList={Array.from(snsPostRspHashMapByTaste.entries()).map(
              ([, v]) => {
                let imageContent = v.postContents.find(
                  (postContent) =>
                    postContent.postContentType !== POST_TEXTFIELD_TYPE,
                )?.content;
                imageContent = imageContent ? imageContent : NO_IMAGE_DATA_LINK;

                const homePostRsp: MasonryPostRsp = {
                  postId: v.postId,
                  userId: v.userId,
                  postContent: imageContent,
                  username: v.username,
                  location: v.location,
                };

                return homePostRsp;
              },
            )}
          />
          <TasteForMeInfiniteScroll />
        </>
      ) : (
        <>
          {Array.from(snsPostRspHashMapByFollow.entries()).length > 0 ? (
            <>
              <MasonryLayout
                snsPostUrlList={Array.from(
                  snsPostRspHashMapByFollow.entries(),
                ).map(([, v]) => {
                  let imageContent = v.postContents.find(
                    (postContent) =>
                      postContent.postContentType !== POST_TEXTFIELD_TYPE,
                  )?.content;
                  imageContent = imageContent
                    ? imageContent
                    : NO_IMAGE_DATA_LINK;

                  const homePostRsp: MasonryPostRsp = {
                    postId: v.postId,
                    userId: v.userId,
                    postContent: imageContent,
                    username: v.username,
                    location: v.location,
                  };

                  return homePostRsp;
                })}
              />
            </>
          ) : (
            <HomeFollowSubBody />
          )}
          <FollowForMeInfiniteScroll />
        </>
      )}
    </HomeBodyContainer>
  );
};

const HomeBodyContainer = styled.div`
  padding-top: 62px;
`;

export default HomeBody;
