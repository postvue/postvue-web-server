import React from 'react';
import { useRecoilValue } from 'recoil';
import { NO_IMAGE_DATA_LINK } from '../../../const/DummyDataConst';
import { POST_TEXTFIELD_TYPE } from '../../../const/PostContentTypeConst';
import { TASTE_FOR_ME_TAB_ID } from '../../../const/TabConfigConst';
import FollowForMeInfiniteScroll from '../../../hook/FollowForMeInfiniteScroll';
import TasteForMeInfiniteScroll from '../../../hook/TasteForMeInfiniteScroll';
import { followForMeListAtom } from '../../../states/FollowForMeAtom';
import { homeTabIdAtom } from '../../../states/HomePageAtom';
import { tasteForMeListAtom } from '../../../states/TasteForMeAtom';
import MasonryLayout from '../../layouts/MasonryLayout';

const HomeBody: React.FC = () => {
  const mainTabId = useRecoilValue(homeTabIdAtom);

  const snsPostRspListByTaste = useRecoilValue(tasteForMeListAtom);
  const snsPostRspListByFollow = useRecoilValue(followForMeListAtom);
  return (
    <>
      {mainTabId === TASTE_FOR_ME_TAB_ID ? (
        <>
          <MasonryLayout
            snsPostUrlList={snsPostRspListByTaste.map((v) => {
              const imageContent = v.postContents.find(
                (postContent) =>
                  postContent.postContentType !== POST_TEXTFIELD_TYPE,
              )?.content;
              return imageContent ? imageContent : NO_IMAGE_DATA_LINK;
            })}
          />
          <TasteForMeInfiniteScroll />
        </>
      ) : (
        <>
          <MasonryLayout
            snsPostUrlList={snsPostRspListByFollow.map((v) => {
              const imageContent = v.postContents.find(
                (postContent) =>
                  postContent.postContentType !== POST_TEXTFIELD_TYPE,
              )?.content;
              return imageContent ? imageContent : NO_IMAGE_DATA_LINK;
            })}
          />
          <FollowForMeInfiniteScroll />
        </>
      )}
    </>
  );
};

export default HomeBody;
