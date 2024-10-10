import BottomNextButton from 'components/common/buttton/BottomNextButton';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {
  isActivPostComposeTargetAudiencePopupAtom,
  uploadResourceLinkListAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import LoadingPopup from 'components/popups/LoadingPopup';
import TagSearchPopup from 'components/popups/TagSearchPopup';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import {
  POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME,
  POST_COMPOSE_LOCATION_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_ID,
  POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_ID,
  POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_NAME,
} from 'const/TabConfigConst';
import {
  PostComposeUploadByResourceLinkReq,
  PostContentInterface,
} from 'global/interface/post';
import { createPostByResourceLink } from 'services/post/createPostByResourceLink';
import { isLoadingPopupAtom } from 'states/SystemConfigAtom';
import { isTagSearchPopupAtom } from 'states/TagAtom';
import theme from 'styles/theme';

import { ReactComponent as PostComposeDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeDeleteButtonIcon.svg';

import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import PostComposeTargetAudiencePopup from 'components/popups/postcompose/PostComposeTargetAudiencePopup';
import { HOME_PATH } from 'const/PathConst';

const PoseComposeBody: React.FC = () => {
  const [isLoadingPopup, setIsLoadingPopup] =
    useRecoilState(isLoadingPopupAtom);
  const [
    isActivPostComposeTargetAudiencePopup,
    setIsActivPostComposeTargetAudiencePopup,
  ] = useRecoilState(isActivPostComposeTargetAudiencePopupAtom);
  const bottomNextButtonRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);
  const [bottomNextButtonHeight, setBottomNextButtonHeight] =
    useState<number>(0);
  const navigate = useNavigate();
  const [uploadResourceLinkList, setUploadResourceLinkList] = useRecoilState(
    uploadResourceLinkListAtom,
  );
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBodyText, setPostBodyText] = useState<string>('');

  const [uploadActive, setUploadActive] = useState<boolean>(
    uploadResourceLinkList.length > 0,
  );

  const [targetAudienceId, setTargetAudienceId] = useState<number>(
    POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  );

  const targetAudTabList = [
    {
      tabName: POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_NAME,
      tabId: POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
    },
    {
      tabName: POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_NAME,
      tabId: POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_ID,
    },
    {
      tabName: POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_NAME,
      tabId: POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_ID,
    },
  ];

  const [tagList, setTagList] = useState<string[]>([]);

  const [isTagSearchPopup, setIsTagSearchPopupAtom] =
    useRecoilState(isTagSearchPopupAtom);

  const postComposeTabList = [
    { tabName: POST_COMPOSE_LOCATION_TAB_NAME },
    {
      tabName: POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME,
      func: () => setIsActivPostComposeTargetAudiencePopup(true),
    },
  ];

  const onClickUploadButton = () => {
    const a = uploadResourceLinkList.map((v, key) => {
      return {
        postContentType: v.contentType,
        content: v.contentUrl,
        ascSortNum: key,
      } as PostContentInterface;
    });

    const postComposeUploadByResourceLinkReq: PostComposeUploadByResourceLinkReq =
      {
        latitude: 0,
        longitude: 0,
        postContents: a,
        tagList: tagList,
        title: postTitle,
        bodyText: postBodyText,
      };
    setIsLoadingPopup(true);
    createPostByResourceLink(postComposeUploadByResourceLinkReq).then(
      (value) => {
        setIsLoadingPopup(false);
        navigate(-1);
      },
    );
  };

  useEffect(() => {
    if (bottomNextButtonRef.current) {
      setBottomNextButtonHeight(bottomNextButtonRef.current.offsetHeight);
    }
    if (uploadResourceLinkList.length === 0) {
      navigate(HOME_PATH);
    }
    return () => {
      setUploadResourceLinkList([]);
      setIsTagSearchPopupAtom(false);
      setIsLoadingPopup(false);
    };
  }, []);

  useEffect(() => {
    if (tagListRef.current) {
      tagListRef.current.scrollLeft = tagListRef.current.scrollWidth;
    }
  }, [tagList]);

  return (
    <PoseComposeBodyContainer>
      <ProfileScrapImgListWrap>
        {uploadResourceLinkList.map((value, k) => (
          <ProfileScrapImgWrap key={k}>
            <ProfileScrapImg src={value.contentUrl} />
            {uploadResourceLinkList.length > 1 && (
              <PostComposeDeleteButtonWrap
                onClick={() => {
                  setUploadResourceLinkList((prev) =>
                    prev.filter(
                      (prevValue) => prevValue.contentUrl !== value.contentUrl,
                    ),
                  );
                }}
              >
                <PostComposeDeleteButtonIcon />
              </PostComposeDeleteButtonWrap>
            )}
          </ProfileScrapImgWrap>
        ))}
      </ProfileScrapImgListWrap>
      <PostComposeTitleWrap>
        <PostComposeTitle
          placeholder={'제목을 넣어주세요'}
          onChange={(e) => setPostTitle(e.target.value)}
          value={postTitle}
        ></PostComposeTitle>
      </PostComposeTitleWrap>
      <PostComposeDescWrap>
        <PostComposeDesc
          rows={8}
          placeholder={'게시물 문구를 작성하세요...'}
          onChange={(e) => setPostBodyText(e.target.value)}
          value={postBodyText}
        ></PostComposeDesc>
      </PostComposeDescWrap>

      <PostBottomLayoutContainer>
        <PostComposeBodyConatiner
          $bottomNextButtonHeight={bottomNextButtonHeight}
        >
          <PostComposeTagListContainer>
            <PostComposeTagListWrap ref={tagListRef}>
              {tagList.map((value, key) => (
                <PostComposeTagWrap key={key}>
                  <BorderCircleButton
                    className={ACTIVE_CLASS_NAME}
                    contentText={value}
                    activeBackgroundColor={theme.mainColor.Blue}
                    activeBorderColor={theme.mainColor.Blue}
                    activeFontColor={theme.mainColor.White}
                  />
                  <PostComposeTagDeleteWrap
                    onClick={() => {
                      setTagList((prev) =>
                        prev.filter((preValue) => preValue !== value),
                      );
                    }}
                  >
                    <PostComposeTagDeleteButtonIcon />
                  </PostComposeTagDeleteWrap>
                </PostComposeTagWrap>
              ))}
              <BorderCircleButton
                className={''}
                contentText={'#태그 추가'}
                deactiveBackgroundColor={theme.grey.Grey1}
                deactiveBorderColor={theme.grey.Grey1}
                deactiveFontColor={theme.grey.Grey8}
                onClickFunc={() => setIsTagSearchPopupAtom(true)}
              />
            </PostComposeTagListWrap>
          </PostComposeTagListContainer>
          <PostComposeBodyWrap>
            {postComposeTabList.map((value, key) => (
              <React.Fragment key={key}>
                <BoundaryStickBar />
                <PostComposeElementWrap onClick={value.func}>
                  <PostComposeElementTitle>
                    {value.tabName}
                  </PostComposeElementTitle>
                  <PostComposeArrowButtonWrap>
                    {value.tabName ===
                      POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME && (
                      <PostComposeTargetDiv>
                        {targetAudTabList[targetAudienceId].tabName}
                      </PostComposeTargetDiv>
                    )}
                    <AccountSettingArrowButtonIcon />
                  </PostComposeArrowButtonWrap>
                </PostComposeElementWrap>
              </React.Fragment>
            ))}
          </PostComposeBodyWrap>
        </PostComposeBodyConatiner>

        <BottomNextButton
          title={'게시물 업로드'}
          notActiveTitle={'게시물 업로드'}
          isTransparent={true}
          bottomNextButtonRef={bottomNextButtonRef}
          actionFunc={onClickUploadButton}
          isActive={uploadResourceLinkList.length > 0}
        />
      </PostBottomLayoutContainer>

      {isTagSearchPopup && (
        <TagSearchPopup tagList={tagList} setTagList={setTagList} />
      )}
      {isActivPostComposeTargetAudiencePopup && (
        <PostComposeTargetAudiencePopup
          targetAudTabList={targetAudTabList}
          targetAudTabId={targetAudienceId}
          setTargetAudTabId={setTargetAudienceId}
        />
      )}

      {isLoadingPopup && <LoadingPopup />}
    </PoseComposeBodyContainer>
  );
};

const PoseComposeBodyContainer = styled.div`
  margin-top: calc(${({ theme }) => theme.systemSize.header.height} + 6px);
`;

const ProfileScrapImgListWrap = styled.div`
  display: flex;
  gap: 5px;
  overflow-x: auto;
  white-space: nowrap;

  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProfileScrapImgWrap = styled.div`
  width: 40%;
  flex: 0 0 auto;
  // @media (hover: hover) and (pointer: fine) {
  //   &:hover {
  //     filter: brightness(0.7);
  //   }
  // }
  // cursor: pointer;

  position: relative;
`;

const ProfileScrapImg = styled.div<{ src: string }>`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 8px;
`;

const PostContentVideo = styled.video`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/4;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.mainColor.Black};
`;

const PostComposeTitleWrap = styled.div`
  padding: 23px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 14px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeTitle = styled.input`
  width: 100%;
  outline: none;
  border: 0px;

  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};
`;

const PostComposeDescWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeDesc = styled.textarea`
  resize: none;
  width: 100%;

  font: ${({ theme }) => theme.fontSizes.Body3};
  outline: none;
  border: 0px;

  color: ${({ theme }) => theme.grey.Grey8};
  background-color: ${({ theme }) => theme.mainColor.White};

  &::-webkit-scrollbar {
    display: block;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.grey.Grey5};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.grey.Grey1};
  }
`;

const PostComposeBodyConatiner = styled.div<{
  $bottomNextButtonHeight: number;
}>`
    display: flex;
    flex-flow: column;
    gap: 16px;
    position: fixed;
    bottom: calc(${(props) => props.$bottomNextButtonHeight}px + 46px);
    width: 100%;
    max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth}
    
}`;

const PostComposeBodyWrap = styled.div``;

const PostComposeElementWrap = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
`;

const PostComposeArrowButtonWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

const PostBottomLayoutContainer = styled.div``;

const PostComposeTagListContainer = styled.div``;

const PostComposeTagListWrap = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeDeleteButtonWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px 5px 0 0;
  cursor: pointer;
`;

const PostComposeTagWrap = styled.div`
  position: relative;
`;

const PostComposeTagDeleteWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const PostComposeTargetDiv = styled.div`
  margin: auto 0;
`;

export default PoseComposeBody;
