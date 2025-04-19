import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { removeHashTag, startsWithHashTag } from 'global/util/SearchUtil';
import { QueryStateRecommTagList } from 'hook/queryhook/QueryStateRecommTagList';
import React from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { filterBrigntnessStyle } from 'styles/commonStyles';
import {
  SEARCH_POST_PATH,
  SEARCH_TAG_POST_ROUTE_PATH,
} from '../../../const/PathConst';
import theme from '../../../styles/theme';

interface SearchBodyProps {
  size: { width: number; height: number };
  onSetSize: (size: { width: number; height: number }) => void;
  SearchTagRecommContainerStyle?: React.CSSProperties;
}

const SearchBodyRecommComponent: React.FC<SearchBodyProps> = ({
  size,
  onSetSize,
  SearchTagRecommContainerStyle,
}) => {
  const navigate = useNavigate();

  const { data: recommTagList } = QueryStateRecommTagList();

  // ref를 콜백 ref로 변경
  const handleRef = (element: HTMLDivElement | null) => {
    if (element) {
      const { width, height } = element.getBoundingClientRect();

      // 크기가 변경된 경우에만 상태 업데이트
      if (size.width !== width || size.height !== height) {
        onSetSize({ width, height });
      }
    }
  };

  return (
    <SearchTagRecommContainer style={SearchTagRecommContainerStyle}>
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

                    if (startsWithHashTag(v.tagName)) {
                      // stackRouterPush(
                      //   navigate,
                      //   generatePath(SEARCH_TAG_POST_ROUTE_PATH, {
                      //     search_word: removeHashTag(searchTempWord),
                      //   }),
                      //   data,
                      // );
                      navigate(
                        generatePath(SEARCH_TAG_POST_ROUTE_PATH, {
                          search_word: removeHashTag(v.tagName),
                        }),
                      );
                    } else {
                      // stackRouterPush(
                      //   navigate,
                      //   `${SEARCH_POST_PATH}/${v.tagName}`,
                      //   data,
                      // );
                      navigate(`${SEARCH_POST_PATH}/${v.tagName}`);
                    }
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
  );
};

const SearchTagRecommContainer = styled.div`
  margin: 0 ${theme.systemSize.appDisplaySize.bothSidePadding} 20px
    ${theme.systemSize.appDisplaySize.bothSidePadding};
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

export default SearchBodyRecommComponent;
