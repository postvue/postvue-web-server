import { PROFILE_NEW_SCRAP_PATH } from 'const/PathConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface SelectScrapByComposeHeaderProps {
  SelectScrapByComposeHeaderContainerStyle?: React.CSSProperties;
}

const SelectScrapByComposeHeader: React.FC<SelectScrapByComposeHeaderProps> = ({
  SelectScrapByComposeHeaderContainerStyle,
}) => {
  const navigate = useNavigate();
  const onClickCreateScrapWithPost = () => {
    stackRouterPush(navigate, PROFILE_NEW_SCRAP_PATH);
  };
  return (
    <ScrapViewPopupTitleWrap style={SelectScrapByComposeHeaderContainerStyle}>
      <ScrapViewPopupTitle>스크랩</ScrapViewPopupTitle>
      <ScrapViewCreateButton
        onClick={() => {
          onClickCreateScrapWithPost();
        }}
      >
        신규 생성
      </ScrapViewCreateButton>
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

export default SelectScrapByComposeHeader;
