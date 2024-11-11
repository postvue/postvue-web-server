import { QueryStateSearchFavoriteTermList } from 'hook/queryhook/QueryStateSearchFavoriteTermList';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import {
  SEARCH_FAVORITE_LIST_PATH,
  SEARCH_POST_PATH,
} from '../../../const/PathConst';
import { getRecommTagList } from '../../../services/recomm/getRecommTagList';
import { recommTagListAtom } from '../../../states/TagAtom';
import theme from '../../../styles/theme';
import ScrollXMoveButtonContainer from '../../common/buttton/ScrollXMoveButtonContainer';

interface SearchBodyProps {
  SearchBodyStyle?: React.CSSProperties;
}

const SearchBody: React.FC<SearchBodyProps> = ({ SearchBodyStyle }) => {
  const naviate = useNavigate();
  const [recommTagList, setRecommTagList] = useRecoilState(recommTagListAtom);
  const { data } = QueryStateSearchFavoriteTermList();

  const [size, setSize] = useState({ width: 0, height: 0 });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 태그 리스트 가져오기
    getRecommTagList().then((value) => {
      setRecommTagList(value);
    });
  }, []);

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

  return (
    <>
      <SearchBodyContainer style={SearchBodyStyle}>
        {data !== undefined && data.length > 0 && (
          <SearchFavoriteTermContainer>
            <FavoriteTermListWrap>
              <FavoriteTermListTitle>즐겨찾는 검색어</FavoriteTermListTitle>
              <FavoriteTermListEdit
                onClick={() => naviate(SEARCH_FAVORITE_LIST_PATH)}
              >
                목록편집
              </FavoriteTermListEdit>
            </FavoriteTermListWrap>
            <ScrollXMoveButtonContainer
              scrollContainerRef={scrollContainerRef}
              leftMoveNum={size.width + FavoriteTermListWrapGapNumber}
            >
              <SearchFavoriteItemListWrap ref={scrollContainerRef}>
                {data.map((v, i) => (
                  <FavoriteTermContainer
                    key={i}
                    style={{
                      width: `${size.width}px`,
                      height: `${size.height}px`,
                      paddingLeft: i === 0 ? SuggestContainerSideMargin : '0',
                      paddingRight:
                        i === data.length - 1 ? SuggestContainerSideMargin : '',
                    }}
                  >
                    <Link to={`${SEARCH_POST_PATH}/${v.favoriteTermName}`}>
                      <TagElementWrap $tagBkgdPath={v.favoriteTermContent}>
                        <TagNameDiv>{v.favoriteTermName}</TagNameDiv>
                      </TagElementWrap>
                    </Link>
                  </FavoriteTermContainer>
                ))}
              </SearchFavoriteItemListWrap>
            </ScrollXMoveButtonContainer>
          </SearchFavoriteTermContainer>
        )}

        <SearchTagRecommContainer>
          <SearchRelatedTitle>추천 태그</SearchRelatedTitle>
          <SearchSuggestItemListContainer>
            <SearchSuggestItemListWrap>
              {recommTagList &&
                recommTagList.map((v, i) => (
                  <TagElementContainer key={i} ref={i === 0 ? handleRef : null}>
                    <Link to={`${SEARCH_POST_PATH}/${v.tagName}`}>
                      {/* @REFER: 콘텐츠 타입에 따라 다르게 보이도록 */}
                      <TagElementWrap $tagBkgdPath={v.tagBkgdContent}>
                        <TagNameDiv>#{v.tagName}</TagNameDiv>
                      </TagElementWrap>
                    </Link>
                  </TagElementContainer>
                ))}
            </SearchSuggestItemListWrap>
          </SearchSuggestItemListContainer>
        </SearchTagRecommContainer>
      </SearchBodyContainer>
    </>
  );
};
const SuggestContainerSideMarginNumber = 21;
const FavoriteTermListWrapGapNumber = 10;
const SuggestContainerSideMargin = `${SuggestContainerSideMarginNumber}px`;

const SearchTagRecommContainer = styled.div`
  margin: 0 ${SuggestContainerSideMargin};
`;

const SearchBodyContainer = styled.div`
  margin: 22px 0 0 0;
`;

const SearchRelatedTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  padding-bottom: 12px;
`;

const SearchSuggestItemListContainer = styled.div`
  padding-bottom: 20px;
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
  border-radius: 8px;
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
  margin: 0 0 40px 0;
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
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  margin: auto 0;
  text-decoration-line: underline;
  letter-spacing: -0.3px;
  text-underline-offset: 2px;
  font-weight: 600;
  cursor: pointer;
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
