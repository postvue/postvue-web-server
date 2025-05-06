import { ReactComponent as SearchRecentlyDeleteButtonIcon } from 'assets/images/icon/svg/SearchRecentlyDeleteButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import HorizontalGrabScrollContainer from 'components/common/container/HorizontalGrabScrollContainer';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { SearchRecentKeywordInterface } from 'global/interface/localstorage/SearchInterface';
import React, { useRef } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface SearchRecentListElementProps {
  searchRecentKeyworList: SearchRecentKeywordInterface[];
  onClickFunc: (searchWord: string) => void;
  onDeleteSearchWord: (searchWord: string) => void;
  SearchRecentListContainerStyle?: React.CSSProperties;
  SearchRecentListRef?: React.RefObject<HTMLDivElement>;
}
const SearchRecentListElement: React.FC<SearchRecentListElementProps> = ({
  searchRecentKeyworList,
  onClickFunc,
  onDeleteSearchWord,
  SearchRecentListContainerStyle,
  SearchRecentListRef,
}) => {
  const SearchRecentListRef_ = SearchRecentListRef
    ? SearchRecentListRef
    : useRef<HTMLDivElement>(null);

  return (
    <HorizontalGrabScrollContainer
      horiontalContainerRef={SearchRecentListRef_}
      HorizontalGrabScrollContainerStyle={{
        ...{
          gap: '10px',
          padding: `0 ${theme.systemSize.appDisplaySize.bothSidePadding} 0px ${theme.systemSize.appDisplaySize.bothSidePadding}`,
        },
        ...SearchRecentListContainerStyle,
        height: '50px',
      }}
    >
      {searchRecentKeyworList.map((value, key) => (
        <PostComposeTagWrap key={key}>
          <BorderCircleButton
            className={ACTIVE_CLASS_NAME}
            fontSize={theme.fontSizes.Body2_5}
            contentText={value.name}
            activeBackgroundColor={theme.mainColor.White}
            activeBorderColor={theme.grey.Grey1}
            activeFontColor={theme.mainColor.Black}
            onClickFunc={() => onClickFunc(value.name)}
          />
          <PostComposeTagDeleteWrap
            onClick={() => {
              onDeleteSearchWord(value.name);
            }}
          >
            <SearchRecentlyDeleteButtonIcon />
          </PostComposeTagDeleteWrap>
        </PostComposeTagWrap>
      ))}
    </HorizontalGrabScrollContainer>
  );
};

const PostComposeTagWrap = styled.div`
  position: relative;
`;

const PostComposeTagDeleteWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export default SearchRecentListElement;
