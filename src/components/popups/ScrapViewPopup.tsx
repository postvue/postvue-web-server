import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { postRspAtom } from 'states/PostAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import { PROFILE_NEW_SCRAP_PATH } from '../../const/PathConst';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID,
} from '../../const/QueryParamConst';
import { PostToScrapListReq } from '../../global/interface/profile';
import { createPostToScrapList } from '../../services/profile/createPostToScrapList';
import {
  isActiveScrapViewPopupAtom,
  myProfileClipHashMapAtom,
  profilePostHashMapAtom,
} from '../../states/ProfileAtom';
import ProfileScrapViewBody from '../common/body/ProfileScrapViewBody';
import PopupLayout from '../layouts/PopupLayout';

const popupWrapStyle: React.CSSProperties = {
  height: '85%',
};

interface ScrapViewPopupProps {
  postId: string;
  postContentUrl: string;
  postContentType: string;
}

const ScrapViewPopup: React.FC<ScrapViewPopupProps> = ({
  postId,
  postContentType,
  postContentUrl,
}) => {
  // 클립 관련 상태 관리
  const [profilePostHashMap, setProfilePostHashMap] = useRecoilState(
    profilePostHashMapAtom,
  );
  const [myProfileClipHashMap, setMyProfileClipHashMap] = useRecoilState(
    myProfileClipHashMapAtom,
  );

  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  const navigate = useNavigate();
  const setIsActiveScrapViewPopup = useSetRecoilState(
    isActiveScrapViewPopupAtom,
  );

  const ScrapViewBodyRef = useRef<HTMLDivElement>(null);

  const [selectedScrapList, setSelectedScrapList] = useState<string[]>([]);

  const onSelectScraps = (scrapId: string) => {
    if (selectedScrapList.includes(scrapId)) {
      setSelectedScrapList((prev) => prev.filter((value) => value !== scrapId));
    } else {
      setSelectedScrapList((prev) => [...prev, scrapId]);
    }
  };

  const onClickPostToScrapList = () => {
    const postToScrapListReq: PostToScrapListReq = {
      scrapIdList: selectedScrapList,
    };
    createPostToScrapList(postToScrapListReq, postId).then((value) => {
      setIsActiveScrapViewPopup(false);
      onClickClipGlobalState(
        postId,
        profilePostHashMap,
        setProfilePostHashMap,
        myProfileClipHashMap,
        setMyProfileClipHashMap,
        !snsPost.isClipped,
        {
          location: snsPost.location,
          postThumbnailContent: snsPost.postContents[0].content,
          userId: snsPost.userId,
          username: snsPost.username,
          postedAt: snsPost.postedAt,
        },
      );
      setSnsPost((prev) => ({ ...prev, isClipped: value.isClipped }));
    });
  };

  const onClickCreateScrapWithPost = () => {
    navigate(
      `${PROFILE_NEW_SCRAP_PATH}?${POST_ID}=${postId}&${POST_CONTENT_URL}=${postContentUrl}&${POST_CONTENT_TYPE}=${postContentType}`,
    );
  };

  return (
    <PopupLayout
      setIsPopup={setIsActiveScrapViewPopup}
      popupWrapStyle={popupWrapStyle}
    >
      <ScrapViewPopupTitleWrap>
        <ScrapViewPopupTitle>전체 스크랩 보기</ScrapViewPopupTitle>
        {postId && postContentUrl && postContentType && (
          <ScrapViewCreateButton onClick={onClickCreateScrapWithPost}>
            신규 생성
          </ScrapViewCreateButton>
        )}
      </ScrapViewPopupTitleWrap>
      <ProfileScrapViewBody
        isAddMove={true}
        profileScrapViewRef={ScrapViewBodyRef}
        onButtonEvent={onSelectScraps}
        mainContainerStyle={ScrapViewPopupContainerStyle}
        scrapIdList={selectedScrapList}
      />
      <AddPostToScrapButtonWrap>
        {selectedScrapList.length > 0 ? (
          <AddPostToScrapButton onClick={onClickPostToScrapList}>
            {selectedScrapList.length}개 스크랩 선택 완료
          </AddPostToScrapButton>
        ) : (
          <AddPostToScrapNotActiveButton>
            0개 스크랩 선택
          </AddPostToScrapNotActiveButton>
        )}
      </AddPostToScrapButtonWrap>
    </PopupLayout>
  );
};

const ADD_POST_TO_SCRAP_BUTTON_HEIGHT = '96px';

const ScrapViewPopupContainerStyle: React.CSSProperties = {
  marginBottom: ADD_POST_TO_SCRAP_BUTTON_HEIGHT,
  overflow: 'scroll',
  height: `calc(100vh - 65px - ${theme.systemSize.bottomNavBar.height})`,
};

const ScrapViewPopupTitleWrap = styled.div`
  position: relative;
  margin: 33px 0 24px 0;
`;

const ScrapViewPopupTitle = styled.div`
  text-align: center;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const ScrapViewCreateButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  position: absolute;
  top: 0;
  right: 0;
  padding-right: 20px;
  color: ${({ theme }) => theme.mainColor.Blue};
  cursor: pointer;
  z-index: 30;
`;

const AddPostToScrapButtonWrap = styled.div`
  height: ${ADD_POST_TO_SCRAP_BUTTON_HEIGHT};
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0px;
  margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};
  text-align: center;
  background-color: ${({ theme }) => theme.mainColor.White};
`;

const AddPostToScrapButton = styled.div`
  padding: 14px 0;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  color: ${({ theme }) => theme.mainColor.White};
  background-color: ${({ theme }) => theme.mainColor.Blue};
  border-radius: 8px;
  margin: 13px 20px 33px 20px;
  cursor: pointer;
`;

const AddPostToScrapNotActiveButton = styled(AddPostToScrapButton)`
  background-color: ${({ theme }) => theme.grey.Grey3};
  opacity: 0.4;
  color: ${({ theme }) => theme.mainColor.Black};
  cursor: auto;
`;

export default ScrapViewPopup;
