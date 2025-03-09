import { ReactComponent as SearchButtonIcon } from 'assets/images/icon/svg/SearchButtonIcon.svg';
import { SEARCH_PATH } from 'const/PathConst';
import { SEARCH_PAGE_NAME } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { navigateToTabWithUrl } from 'global/util/reactnative/nativeRouter';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SearchTabComponent: React.FC = () => {
  const navigate = useNavigate();
  return (
    <SearchTab>
      <SubTabContainer
        onClick={() => {
          navigateToTabWithUrl(navigate, SEARCH_PAGE_NAME, SEARCH_PATH);
        }}
      >
        <SearchButtonIcon />
      </SubTabContainer>
    </SearchTab>
  );
};

const SubTabContainer = styled.div`
  cursor: pointer;
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: flex;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    display: none;
  }
  margin: auto 0px;

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: -15px;
    left: -15px;
    right: -15px;
    z-index: -1; /* 가상 요소를 버튼 뒤로 배치 */
    background: transparent; /* 투명 */
  }
`;

const SearchTab = styled.div`
  position: relative;
  display: flex;
`;

export default SearchTabComponent;
