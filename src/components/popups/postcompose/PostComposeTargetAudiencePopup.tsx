import HeaderLayout from 'components/layouts/HeaderLayout';
import PopupLayout from 'components/layouts/PopupLayout';
import React from 'react';
import { useRecoilState } from 'recoil';
import { isActivPostComposeTargetAudiencePopupAtom } from 'states/PostComposeAtom';
import styled from 'styled-components';

import { ReactComponent as PostComposeTargetAudTabIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as PostComposeTargetAudNotActiveTabIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';

interface PostComposeTargetAudiencePopupProps {
  targetAudTabList: {
    tabName: string;
    tabId: number;
  }[];
  targetAudTabId: number;
  setTargetAudTabId: React.Dispatch<React.SetStateAction<number>>;
}

const PostComposeTargetAudiencePopup: React.FC<
  PostComposeTargetAudiencePopupProps
> = ({ targetAudTabList, targetAudTabId, setTargetAudTabId }) => {
  const [
    isActivPostComposeTargetAudiencePopup,
    setIsActivPostComposeTargetAudiencePopup,
  ] = useRecoilState(isActivPostComposeTargetAudiencePopupAtom);

  return (
    <PopupLayout
      setIsPopup={setIsActivPostComposeTargetAudiencePopup}
      isTouchScrollBar={true}
      popupWrapStyle={popupWrapStyle}
      hasFixedActive={false}
    >
      <PostComposeTargetHeaderContainer>
        <HeaderLayout>
          <PostComposeTargetHeaderTitle>공개 대상</PostComposeTargetHeaderTitle>
        </HeaderLayout>
        <PostComposeTargetBodyContainer>
          {targetAudTabList.map((value, key) => (
            <PostComposeTargetWrap
              key={key}
              onClick={() => {
                setTargetAudTabId(value.tabId);
              }}
            >
              <PostComposeTargetAudienceTab>
                {value.tabName}
              </PostComposeTargetAudienceTab>

              <PostComposeTargetAudTabWrap>
                {targetAudTabId === value.tabId ? (
                  <PostComposeTargetAudTabIcon />
                ) : (
                  <PostComposeTargetAudNotActiveTabIcon />
                )}
              </PostComposeTargetAudTabWrap>
            </PostComposeTargetWrap>
          ))}
        </PostComposeTargetBodyContainer>
      </PostComposeTargetHeaderContainer>
    </PopupLayout>
  );
};

const popupWrapStyle: React.CSSProperties = {
  height: 'auto',
  paddingBottom: '61px',
};

const PostComposeTargetHeaderContainer = styled.div`
  margin-top: 29px;
  flex: 1;
`;

const PostComposeTargetHeaderTitle = styled.div`
  width: 100%;
  margin: auto;
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const PostComposeTargetBodyContainer = styled.div`
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const PostComposeTargetWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const PostComposeTargetAudienceTab = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 18px;
`;

const PostComposeTargetAudTabWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

export default PostComposeTargetAudiencePopup;
