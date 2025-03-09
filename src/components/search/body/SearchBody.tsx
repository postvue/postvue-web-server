import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { FAVORITE_TERM_TITLE } from 'const/SystemPhraseConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import { removeHashTag, startsWithHashTag } from 'global/util/SearchUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateRecommTagList } from 'hook/queryhook/QueryStateRecommTagList';
import { QueryStateSearchFavoriteTermPreviewList } from 'hook/queryhook/QueryStateSearchFavoritePreviewTermList';
import React, { useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isActiveSearchFavoritePopupAtom } from 'states/SearchPostAtom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import {
  SEARCH_FAVORITE_LIST_PATH,
  SEARCH_POST_PATH,
  SEARCH_POST_ROUTE_PATH,
  SEARCH_TAG_POST_ROUTE_PATH,
} from '../../../const/PathConst';
import theme from '../../../styles/theme';
import ScrollXMoveButtonContainer from '../../common/buttton/ScrollXMoveButtonContainer';

interface SearchBodyProps {
  SearchBodyStyle?: React.CSSProperties;
  isDisplayFavoriteTerm?: boolean;
}

const SearchBody: React.FC<SearchBodyProps> = ({
  SearchBodyStyle,
  isDisplayFavoriteTerm = true,
}) => {
  const naviate = useNavigate();
  const { data: favoriteTermList } = QueryStateSearchFavoriteTermPreviewList();

  const [size, setSize] = useState({ width: 0, height: 0 });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: recommTagList } = QueryStateRecommTagList();

  // ref를 콜백 ref로 변경
  const handleRef = (element: HTMLDivElement | null) => {
    if (element) {
      const { width, height } = element.getBoundingClientRect();

      // 크기가 변경된 경우에만 상태 업데이트
      if (size.width !== width || size.height !== height) {
        setSize({ width, height });
      }
    }
  };

  const setIsActiveSearchFavoritePopup = useSetRecoilState(
    isActiveSearchFavoritePopupAtom,
  );

  const { windowWidth } = useWindowSize();
  return (
    <SearchBodyContainer style={SearchBodyStyle}>
      {isDisplayFavoriteTerm && favoriteTermList !== undefined && (
        <SearchFavoriteTermContainer>
          <FavoriteTermListWrap>
            <FavoriteTermListTitle>{FAVORITE_TERM_TITLE}</FavoriteTermListTitle>
            <FavoriteTermListEdit
              onClick={() => {
                if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
                  setIsActiveSearchFavoritePopup(true);
                } else {
                  stackRouterPush(naviate, SEARCH_FAVORITE_LIST_PATH);
                }
              }}
            >
              목록 편집
            </FavoriteTermListEdit>
          </FavoriteTermListWrap>
          <ScrollXMoveButtonContainer
            scrollContainerRef={scrollContainerRef}
            leftMoveNum={size.width + FavoriteTermListWrapGapNumber}
          >
            <SearchFavoriteItemListWrap ref={scrollContainerRef}>
              {favoriteTermList.map((v, i) => (
                <FavoriteTermContainer
                  key={i}
                  style={{
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    paddingLeft: i === 0 ? SuggestContainerSideMargin : '0',
                    paddingRight:
                      i === favoriteTermList.length - 1
                        ? SuggestContainerSideMargin
                        : '',
                  }}
                >
                  <div
                    onClick={() => {
                      const data: RoutePushEventDateInterface = {
                        isShowInitBottomNavBar: true,
                      };
                      if (startsWithHashTag(v.favoriteTermName)) {
                        const keyword = removeHashTag(v.favoriteTermName);

                        stackRouterPush(
                          naviate,
                          generatePath(SEARCH_TAG_POST_ROUTE_PATH, {
                            search_word: keyword,
                          }),
                          data,
                        );
                      } else {
                        stackRouterPush(
                          naviate,
                          generatePath(SEARCH_POST_ROUTE_PATH, {
                            search_word: v.favoriteTermName,
                          }),
                          data,
                        );
                      }
                    }}
                  >
                    <TagElementWrap $tagBkgdPath={v.favoriteTermContent}>
                      <TagNameDiv>{v.favoriteTermName}</TagNameDiv>
                    </TagElementWrap>
                  </div>
                </FavoriteTermContainer>
              ))}
            </SearchFavoriteItemListWrap>
          </ScrollXMoveButtonContainer>
        </SearchFavoriteTermContainer>
      )}

      <SearchTagRecommContainer>
        <SearchRelatedTitle>추천 단어</SearchRelatedTitle>
        <SearchSuggestItemListContainer>
          <SearchSuggestItemListWrap>
            {recommTagList &&
              recommTagList.map((v, i) => (
                <TagElementContainer key={i} ref={i === 0 ? handleRef : null}>
                  <div
                    onClick={() => {
                      const data: RoutePushEventDateInterface = {
                        isShowInitBottomNavBar: true,
                      };
                      stackRouterPush(
                        naviate,
                        `${SEARCH_POST_PATH}/${v.tagName}`,
                        data,
                      );
                    }}
                  >
                    {/* @REFER: 콘텐츠 타입에 따라 다르게 보이도록 */}
                    {/* @ANSWER: 현재 비디오의 경우도 이미지로 보이게 함 */}
                    <TagElementWrap $tagBkgdPath={v.tagBkgdContent}>
                      <TagNameDiv>{v.tagName}</TagNameDiv>
                    </TagElementWrap>
                  </div>
                </TagElementContainer>
              ))}
          </SearchSuggestItemListWrap>
        </SearchSuggestItemListContainer>
      </SearchTagRecommContainer>
    </SearchBodyContainer>
  );
};

const FavoriteTermListWrapGapNumber = 10;
const SuggestContainerSideMargin =
  theme.systemSize.appDisplaySize.bothSidePadding;

const SearchTagRecommContainer = styled.div`
  margin: 0 ${theme.systemSize.appDisplaySize.bothSidePadding} 20px
    ${theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SearchBodyContainer = styled.div`
  height: 100%;
  min-height: calc(100dvh - ${theme.systemSize.header.height});
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  padding-bottom: 12px;
`;

const SearchSuggestItemListContainer = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-bottom: ${({ theme }) => theme.systemSize.bottomNavBar.height};
  }
`;
const SearchSuggestItemListWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const TagElementContainer = styled.div`
  cursor: pointer;
  ${filterBrigntnessStyle}
`;

const TagElementWrap = styled.div<{ $tagBkgdPath: string }>`
  text-align: center;

  font: ${({ theme }) => theme.fontSizes.Subhead2};
  padding: 39px 0px;
  border-radius: 20px;
  margin: 0 auto;
  color: white;

  ${(props) =>
    props.$tagBkgdPath
      ? `background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${props.$tagBkgdPath}) center center / cover;`
      : `background-color: ${theme.grey.Grey7};`};
`;

const TagNameDiv = styled.div``;

// 즐겨찾기 검색어 컨테이너 부분
const SearchFavoriteTermContainer = styled.div`
  margin: 22px 0 40px 0;
`;

const FavoriteTermListWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 ${SuggestContainerSideMargin};
  padding-bottom: 12px;
`;

const FavoriteTermListTitle = styled(SearchRelatedTitle)`
  padding-bottom: 0px;
`;

const FavoriteTermListEdit = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  font-size: 15px;
  margin: auto 0;
  text-decoration-line: underline;
  letter-spacing: -0.3px;
  text-underline-offset: 2px;
  cursor: pointer;
  color: ${({ theme }) => theme.grey.Grey9};
`;

const SearchFavoriteItemListWrap = styled.div`
  display: flex;
  overflow-x: auto;
  gap: ${FavoriteTermListWrapGapNumber}px;
`;

const FavoriteTermContainer = styled(TagElementContainer)`
  flex: 0 0 auto;
  ${filterBrigntnessStyle}
`;

export default SearchBody;
