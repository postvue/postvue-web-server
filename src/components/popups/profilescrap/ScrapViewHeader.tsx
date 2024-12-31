import { PROFILE_NEW_SCRAP_PATH } from 'const/PathConst';
import {
  POST_CONTENT_TYPE,
  POST_CONTENT_URL,
  POST_ID,
} from 'const/QueryParamConst';
import { stackRouterPush } from 'global/util/reactnative/StackRouter';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface ScrapViewHeaderProps {
  postId: string;
  postContentUrl: string;
  postContentType: string;
  ScrapViewHeaderContainerStyle?: React.CSSProperties;
}

const ScrapViewHeader: React.FC<ScrapViewHeaderProps> = ({
  postId,
  postContentUrl,
  postContentType,
  ScrapViewHeaderContainerStyle,
}) => {
  const navigate = useNavigate();
  const onClickCreateScrapWithPost = () => {
    stackRouterPush(
      navigate,
      `${PROFILE_NEW_SCRAP_PATH}?${POST_ID}=${postId}&${POST_CONTENT_URL}=${postContentUrl}&${POST_CONTENT_TYPE}=${postContentType}`,
    );
  };
  return (
    <ScrapViewPopupTitleWrap style={ScrapViewHeaderContainerStyle}>
      <ScrapViewPopupTitle>스크랩</ScrapViewPopupTitle>
      {postId && postContentUrl && postContentType && (
        <ScrapViewCreateButton
          onClick={() => {
            onClickCreateScrapWithPost();
          }}
        >
          신규 생성
        </ScrapViewCreateButton>
      )}
    </ScrapViewPopupTitleWrap>
  );
};

const ScrapViewPopupTitleWrap = styled.div`
  position: relative;
  padding: 0px 0 10px 0;
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

export default ScrapViewHeader;
