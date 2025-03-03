import React, { useRef } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  isActivPostComposeLocationPopupAtom,
  isActivPostComposeTargetAudiencePopupAtom,
  postComposeAddressRelationAtom,
} from 'states/PostComposeAtom';
import styled from 'styled-components';

import { ReactComponent as AccountSettingArrowButtonIcon } from 'assets/images/icon/svg/AccountSettingArrowButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import {
  POST_COMPOSE__SCRAP_SELECT_TAB_NAME,
  POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME,
  POST_COMPOSE_LOCATION_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_ID,
  POST_COMPOSE_TARGET_AUD_FOLLOW_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_ID,
  POST_COMPOSE_TARGET_AUD_PRIVATE_TAB_NAME,
  POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_ID,
  POST_COMPOSE_TARGET_AUD_PUBLIC_TAB_NAME,
} from 'const/TabConfigConst';
import { isTagSearchPopupAtom } from 'states/TagAtom';
import theme from 'styles/theme';

import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import HorizontalGrabScrollContainer from 'components/common/container/HorizontalGrabScrollContainer';
import { selectScrapByComposePopupInfoAtom } from 'states/ProfileAtom';

interface PostComposeBodyBottomContentProps {
  postTagList: string[];
  setPostTagList: React.Dispatch<React.SetStateAction<string[]>>;
  targetAudienceId: number;
  setTargetAudienceId: React.Dispatch<React.SetStateAction<number>>;
  bottomNextButtonHeight: number;
}

const PostComposeBodyBottomContent: React.FC<
  PostComposeBodyBottomContentProps
> = ({
  postTagList,
  targetAudienceId,
  setPostTagList,
  bottomNextButtonHeight,
}) => {
  const [selectScrapByComposePopupInfo, setSelectScrapByComposePopupInfo] =
    useRecoilState(selectScrapByComposePopupInfoAtom);
  // 팝업 상태 값
  const setIsActivPostComposeTargetAudiencePopup = useSetRecoilState(
    isActivPostComposeTargetAudiencePopupAtom,
  );

  const tagListRef = useRef<HTMLDivElement>(null);

  // 포스트 콘텐츠 내용
  const poseComposeAddressRelation = useRecoilValue(
    postComposeAddressRelationAtom,
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

  const setIsTagSearchPopupAtom = useSetRecoilState(isTagSearchPopupAtom);

  const setIsActivePostComposeLocationPopup = useSetRecoilState(
    isActivPostComposeLocationPopupAtom,
  );

  const postComposeTabList = [
    {
      tabName: POST_COMPOSE_LOCATION_TAB_NAME,
      func: () => setIsActivePostComposeLocationPopup(true),
    },
    {
      tabName: POST_COMPOSE__SCRAP_SELECT_TAB_NAME,
      func: () =>
        setSelectScrapByComposePopupInfo((prev) => ({
          ...prev,
          isActive: true,
        })),
    },
    {
      tabName: POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME,
      func: () => setIsActivPostComposeTargetAudiencePopup(true),
    },
  ];

  return (
    <>
      <PostBottomLayoutContainer>
        <PostComposeBodyBottomContentConatiner
          $bottomNextButtonHeight={bottomNextButtonHeight}
        >
          <PostComposeTagListContainer>
            <HorizontalGrabScrollContainer horiontalContainerRef={tagListRef}>
              {postTagList.map((value, key) => (
                <PostComposeTagWrap key={key}>
                  <BorderCircleButton
                    className={ACTIVE_CLASS_NAME}
                    contentText={`#${value}`}
                    activeBackgroundColor={theme.mainColor.Blue}
                    activeBorderColor={theme.mainColor.Blue}
                    activeFontColor={theme.mainColor.White}
                  />
                  <PostComposeTagDeleteWrap
                    onClick={() => {
                      setPostTagList((prev) =>
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
                contentText={'#해시태그'}
                deactiveBackgroundColor={theme.grey.Grey1}
                deactiveBorderColor={theme.grey.Grey1}
                deactiveFontColor={theme.grey.Grey8}
                onClickFunc={() => setIsTagSearchPopupAtom(true)}
              />
            </HorizontalGrabScrollContainer>
          </PostComposeTagListContainer>
          <PostComposeBodyBottomContentWrap>
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
                    {value.tabName === POST_COMPOSE_LOCATION_TAB_NAME && (
                      <PostComposeLcationDiv>
                        {poseComposeAddressRelation.buildName
                          ? poseComposeAddressRelation.buildName
                          : poseComposeAddressRelation.roadAddr}
                      </PostComposeLcationDiv>
                    )}
                    {value.tabName === POST_COMPOSE__SCRAP_SELECT_TAB_NAME && (
                      <PostComposeTargetDiv>
                        {selectScrapByComposePopupInfo.scrapInfoList.length > 0
                          ? selectScrapByComposePopupInfo.scrapInfoList.length >
                            1
                            ? `${selectScrapByComposePopupInfo.scrapInfoList[0].scrapName} 외 스크랩`
                            : selectScrapByComposePopupInfo.scrapInfoList[0]
                                .scrapName
                          : ''}
                      </PostComposeTargetDiv>
                    )}
                    <PostComposeArrowButtonSubWrap>
                      <AccountSettingArrowButtonIcon />
                    </PostComposeArrowButtonSubWrap>
                  </PostComposeArrowButtonWrap>
                </PostComposeElementWrap>
              </React.Fragment>
            ))}
          </PostComposeBodyBottomContentWrap>
        </PostComposeBodyBottomContentConatiner>
      </PostBottomLayoutContainer>
    </>
  );
};

const PostComposeBodyBottomContentConatiner = styled.div<{
  $bottomNextButtonHeight: number;
}>`
    display: flex;
    flex-flow: column;
    gap: 16px;
    // position: absolute;
    bottom: calc(${(props) => props.$bottomNextButtonHeight}px + 10px);
    width: 100%;

}`;

const PostComposeBodyBottomContentWrap = styled.div``;

const PostComposeElementWrap = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  white-space: nowrap;
`;

const PostComposeArrowButtonWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const PostComposeArrowButtonSubWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

const PostBottomLayoutContainer = styled.div``;

const PostComposeTagListContainer = styled.div``;

const PostComposeTagWrap = styled.div`
  position: relative;
`;

const PostComposeTagDeleteWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
`;

const PostComposeTargetDiv = styled.div`
  margin: auto 0;
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

const PostComposeLcationDiv = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;

export default PostComposeBodyBottomContent;
