import React from 'react';
import { useRecoilValue } from 'recoil';
import { NO_IMAGE_DATA_LINK } from '../../../const/DummyDataConst';
import { POST_TEXTFIELD_TYPE } from '../../../const/PostContentTypeConst';
import { TASTE_FOR_ME_TAB_ID } from '../../../const/TabConfigConst';
import { HomePostRsp } from '../../../global/interface/post';
import FollowForMeInfiniteScroll from '../../../hook/FollowForMeInfiniteScroll';
import TasteForMeInfiniteScroll from '../../../hook/TasteForMeInfiniteScroll';

import { homeTabIdAtom } from '../../../states/HomePageAtom';

import { followForMeHashMapAtom } from '../../../states/FollowForMeAtom';
import { tasteForMeHashMapAtom } from '../../../states/TasteForMeAtom';
import MasonryLayout from '../../layouts/MasonryLayout';

const HomeBody: React.FC = () => {
  const mainTabId = useRecoilValue(homeTabIdAtom);

  const snsPostRspHashMapByTaste = useRecoilValue(tasteForMeHashMapAtom);
  const snsPostRspHashMapByFollow = useRecoilValue(followForMeHashMapAtom);

  return (
    <>
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

                const homePostRsp: HomePostRsp = {
                  postId: v.postId,
                  userId: v.userId,
                  postContent: imageContent,
                };

                return homePostRsp;
              },
            )}
          />
          <TasteForMeInfiniteScroll />
        </>
      ) : (
        <>
          <MasonryLayout
            snsPostUrlList={Array.from(snsPostRspHashMapByFollow.entries()).map(
              ([, v]) => {
                let imageContent = v.postContents.find(
                  (postContent) =>
                    postContent.postContentType !== POST_TEXTFIELD_TYPE,
                )?.content;
                imageContent = imageContent ? imageContent : NO_IMAGE_DATA_LINK;

                const homePostRsp: HomePostRsp = {
                  postId: v.postId,
                  userId: v.userId,
                  postContent: imageContent,
                };

                return homePostRsp;
              },
            )}
          />
          <FollowForMeInfiniteScroll />
        </>
      )}
    </>
  );
};

export default HomeBody;
