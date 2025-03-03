import React from 'react';
import styled from 'styled-components';

import { ReactComponent as PostComposeTargetAudTabIcon } from 'assets/images/icon/svg/CategoryCheckIcon.svg';
import { ReactComponent as PostComposeTargetAudNotActiveTabIcon } from 'assets/images/icon/svg/CategoryNotCheckIcon.svg';
import { POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME } from 'const/TabConfigConst';

interface PostComposeTargetAudiencePopupBodyProps {
  targetAudTabList: {
    tabName: string;
    tabId: number;
  }[];
  targetAudTabId: number;
  setTargetAudTabId: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
}

const PostComposeTargetAudiencePopupBody: React.FC<
  PostComposeTargetAudiencePopupBodyProps
> = ({ targetAudTabList, targetAudTabId, setTargetAudTabId, onClose }) => {
  return (
    <PostComposeTargetHeaderContainer>
      <PostComposeTarAudTitle>
        <PostComposeTargetHeaderTitle>
          {POST_COMPOSE__TARGET_AUDIENCE_TAB_NAME}
        </PostComposeTargetHeaderTitle>
        <TagPopupCloseButton
          onClick={() => {
            onClose();
          }}
        >
          닫기
        </TagPopupCloseButton>
      </PostComposeTarAudTitle>
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
  );
};

const PostComposeTargetHeaderContainer = styled.div`
  flex: 1;
`;

const PostComposeTarAudTitle = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

const PostComposeTargetHeaderTitle = styled.div`
  left: 50%;
  transform: translate(-50%, 0%);
  position: absolute;

  margin: auto;

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
`;

const PostComposeTargetAudTabWrap = styled.div`
  display: flex;
  margin: auto 0;
`;

const TagPopupCloseButton = styled.div`
  position: absolute;
  font: ${({ theme }) => theme.fontSizes.Body4};
  right: 0px;
  cursor: pointer;
  margin-right: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
  z-index: 100;
`;

export default PostComposeTargetAudiencePopupBody;
