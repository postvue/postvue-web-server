import SearchFavoriteTermButton from 'components/common/buttton/SearchFavoriteTermButton';
import NoResultComponent from 'components/common/container/NoResultComponent';
import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import { SEARCH_POST_PATH } from 'const/PathConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { FAVORITE_TERM_TITLE } from 'const/SystemPhraseConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { QueryStateSearchFavoriteTermListInfinite } from 'hook/queryhook/QueryStateSearchFavoriteTermListInfinite';
import SearchFavoriteListInfiniteScroll from 'hook/SearchFavoriteListInfiniteScroll';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import theme from 'styles/theme';

interface SearchFavoriteTermEditBodyProps {
  SearchFavoriteTermEditContainerStyle?: React.CSSProperties;
}

const SearchFavoriteTermEditBody: React.FC<SearchFavoriteTermEditBodyProps> = ({
  SearchFavoriteTermEditContainerStyle,
}) => {
  const { data: favoriteTermList } = QueryStateSearchFavoriteTermListInfinite();
  const navigate = useNavigate();

  // ref를 콜백 ref로 변경
  const [size, setSize] = useState({ width: 0, height: 0 });
  const handleRef = (element: HTMLDivElement | null) => {
    if (element) {
      const { width, height } = element.getBoundingClientRect();

      // 크기가 변경된 경우에만 상태 업데이트
      if (size.width !== width || size.height !== height) {
        setSize({ width, height });
      }
    }
  };

  return (
    <SearchFavoriteTermEditContainer
      style={SearchFavoriteTermEditContainerStyle}
    >
      <PrevButtonHeaderHeader titleName={FAVORITE_TERM_TITLE} />
      <SearchFavoriteItemListWrap>
        {/* {favoriteTermList !== undefined &&
            favoriteTermList.map((value, key) => (
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
            ))} */}

        <SearchSuggestItemListContainer>
          {favoriteTermList && (
            <SearchSuggestItemListWrap>
              {favoriteTermList.pages
                .flatMap((v) => v)
                .map((v, i) => (
                  <TagElementContainer key={i} ref={i === 0 ? handleRef : null}>
                    <TagElementSubContainer
                      onClick={(e) => {
                        e.stopPropagation();
                        const data: RoutePushEventDateInterface = {
                          isShowInitBottomNavBar: true,
                        };
                        stackRouterPush(
                          navigate,
                          `${SEARCH_POST_PATH}/${v.favoriteTermName}`,
                          data,
                        );
                      }}
                    >
                      {/* @REFER: 콘텐츠 타입에 따라 다르게 보이도록 */}
                      {/* @ANSWER: 현재 비디오의 경우도 이미지로 보이게 함 */}
                      <TagElementWrap $tagBkgdPath={v.favoriteTermContent}>
                        <TagNameDiv>{v.favoriteTermName}</TagNameDiv>
                        <SearchFavoriteTermButton
                          searchWord={v.favoriteTermName}
                          isFavoriteTerm={true}
                          FavoriteTermButtonStyle={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            padding: '8px',
                            margin: '0px',
                          }}
                        />
                      </TagElementWrap>
                    </TagElementSubContainer>
                  </TagElementContainer>
                ))}
              {favoriteTermList.pages.flatMap((v) => v).length <= 0 && (
                <NoResultComponent title="찜한 검색어가 없습니다." />
              )}
            </SearchSuggestItemListWrap>
          )}
          <SearchFavoriteListInfiniteScroll />
        </SearchSuggestItemListContainer>
      </SearchFavoriteItemListWrap>
    </SearchFavoriteTermEditContainer>
  );
};

const SearchFavoriteTermEditContainer = styled.div``;

const SearchFavoriteItemListWrap = styled.div`
  padding-top: 10px;
`;

const SearchSuggestItemListContainer = styled.div`
  margin: 0 ${theme.systemSize.appDisplaySize.bothSidePadding};
`;
const SearchSuggestItemListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const TagElementContainer = styled.div`
  cursor: pointer;
  ${filterBrigntnessStyle}
`;

const TagElementSubContainer = styled.div`
  position: relative;
`;

const TagElementWrap = styled.div<{ $tagBkgdPath: string }>`
  text-align: center;
  aspect-ratio: 5/3;
  display: flex;

  font: ${({ theme }) => theme.fontSizes.Subhead2};
  border-radius: 20px;
  margin: 0 auto;
  color: white;

  ${(props) =>
    props.$tagBkgdPath
      ? `background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${props.$tagBkgdPath}) center center / cover;`
      : `background-color: ${theme.grey.Grey7};`};
`;

const TagNameDiv = styled.div`
  margin: auto;
`;

export default SearchFavoriteTermEditBody;
