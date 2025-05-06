import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { searchWordAtom } from 'states/SearchPostAtom';
import styled from 'styled-components';
import theme from 'styles/theme';
import SearchFilterButton from './SearchFilterButton';
import SearchScrapSubBody from './SearchScrapSubBody';

const SearchScrapBody: React.FC = () => {
  const searchWord = useRecoilValue(searchWordAtom);

  const { windowWidth } = useWindowSize();

  return (
    <SearchScrapBodyContainer>
      {windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM && (
        <SearchFilterContainer>
          <SearchFilterButton />
        </SearchFilterContainer>
      )}

      <SearchScrapSubBody
        searchWord={searchWord}
        ContainerStyle={{ paddingTop: theme.systemSize.header.height }}
      />
    </SearchScrapBodyContainer>
  );
};

const SearchScrapBodyContainer = styled.div``;

const SearchFilterContainer = styled.div`
  position: fixed;
  padding-top: env(safe-area-inset-top);
  max-width: ${({ theme }) => theme.systemSize.appDisplaySize.maxWidth};

  z-index: 10;
  width: 100%;
  top: ${({ theme }) => theme.systemSize.header.height};
  background-color: ${({ theme }) => theme.mainColor.White};

  display: flex;
  justify-content: end;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

export default SearchScrapBody;
