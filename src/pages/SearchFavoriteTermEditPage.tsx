import SearchFavoriteTermButton from 'components/common/buttton/SearchFavoriteTermButton';
import BoundaryStickBar from 'components/common/container/BoundaryStickBar';
import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { SEARCH_POST_PATH } from 'const/PathConst';
import { QueryStateSearchFavoriteTermList } from 'hook/queryhook/QueryStateSearchFavoriteTermList';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SearchFavoriteTermEditPage: React.FC = () => {
  const { data } = QueryStateSearchFavoriteTermList();
  const navigate = useNavigate();
  return (
    <AppBaseTemplate>
      <SearchFavoriteTermEditContainer>
        <PrevButtonHeaderHeader titleName={'즐겨찾는 검색어'} />
        <SearchFavoriteItemListWrap>
          {data !== undefined &&
            data.map((value, key) => (
              <React.Fragment key={key}>
                <ProfileAccountSettingElementWrap
                  onClick={() =>
                    navigate(`${SEARCH_POST_PATH}/${value.favoriteTermName}`)
                  }
                >
                  <SearchFavoriteTermButton
                    searchWord={value.favoriteTermName}
                  />
                  <ProfileAccountSettingElementTitle>
                    {value.favoriteTermName}
                  </ProfileAccountSettingElementTitle>
                </ProfileAccountSettingElementWrap>
                <BoundaryStickBar />
              </React.Fragment>
            ))}
        </SearchFavoriteItemListWrap>
      </SearchFavoriteTermEditContainer>
    </AppBaseTemplate>
  );
};

const SearchFavoriteTermEditContainer = styled.div``;

const ProfileAccountSettingElementWrap = styled.div`
  display: flex;
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  cursor: pointer;
`;

const ProfileAccountSettingElementTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

const SearchFavoriteItemListWrap = styled.div``;

export default SearchFavoriteTermEditPage;
