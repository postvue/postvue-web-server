import SearchButtonInput from 'components/common/input/SearchButtonInput';
import HeaderLayout from 'components/layouts/HeaderLayout';
import PopupLayout from 'components/layouts/PopupLayout';
import { TAG_SEARCH_PHASE_TEXT } from 'const/SystemPhraseConst';
import { isValidString } from 'global/util/\bValidUtil';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getTagSearchQuery } from 'services/search/getTagSearchQuery';
import {
  isTagSearchPopupAtom,
  tagSearchInputAtom,
  tagSearchQueryHashMapAtom,
} from 'states/TagAtom';
import styled from 'styled-components';

import loadingBarGif from 'assets/images/gif/loadingBar.gif';
import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import theme from 'styles/theme';

interface TagSearchPopupProps {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagSearchPopup: React.FC<TagSearchPopupProps> = ({
  tagList,
  setTagList,
}) => {
  const tagListRef = useRef<HTMLDivElement>(null);
  const tagSearchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const [isTagSearchPopup, setIsTagSearchPopupAtom] =
    useRecoilState(isTagSearchPopupAtom);

  const [tagSearchInput, setTagSearchInput] =
    useRecoilState(tagSearchInputAtom);

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setLoading(true);
    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }
    setTagSearchInput(event.target.value);
  };
  const [tagSearchQueryHashMap, setTagSearchQueryHashMap] = useRecoilState(
    tagSearchQueryHashMapAtom,
  );

  const [loading, setLoading] = useState(false); // Loading state

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isValidString(tagSearchInput)
    ) {
      tagSearchInputRef.current?.blur();
      saveTagToList(tagSearchInput);
      onSearchInputDelete();
    }
  };

  const onSearchInputDelete = () => {
    setTagSearchInput('');
  };

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      if (!tagSearchQueryHashMap.get(word)) {
        getTagSearchQuery(word)
          .then((value) => {
            const tempSearchQueryRelationHashMap = new Map(
              tagSearchQueryHashMap,
            );
            tempSearchQueryRelationHashMap.set(word, value);
            setTagSearchQueryHashMap(tempSearchQueryRelationHashMap);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    },
    [tagSearchQueryHashMap],
  );

  const saveTagToList = (searchQuery: string) => {
    if (!tagList.includes(searchQuery)) {
      setTagList((prev) => [...prev, searchQuery]);
    }
  };

  const onClickTagSearchQuery = (searchQuery: string) => {
    saveTagToList(searchQuery);
    onSearchInputDelete();
  };

  useEffect(() => {
    return () => {
      setTagSearchInput('');
    };
  }, []);

  useEffect(() => {
    if (tagListRef.current) {
      tagListRef.current.scrollLeft = tagListRef.current.scrollWidth;
    }
  }, [tagList]);

  return (
    <PopupLayout
      setIsPopup={setIsTagSearchPopupAtom}
      isTouchScrollBar={true}
      popupWrapStyle={PopupWrapStyle}
      hasFixedActive={false}
    >
      <SearchButtonInputHeaderContainer>
        <HeaderLayout>
          <PostComposeSearchInputWrap>
            <SearchButtonInputWrap>
              <SearchButtonInput
                searchInputRef={tagSearchInputRef}
                placeholder={TAG_SEARCH_PHASE_TEXT}
                onSearchInputChange={onSearchInputChange}
                onSearchInputKeyDown={handleKeyPress}
                onClickDelete={onSearchInputDelete}
                value={tagSearchInput}
                isActiveDeleteButton={tagSearchInput !== ''}
              />
            </SearchButtonInputWrap>
          </PostComposeSearchInputWrap>
        </HeaderLayout>
        {loading ? (
          <SearchLoadingWrap>
            <SearchLoadingGif src={loadingBarGif} />
          </SearchLoadingWrap>
        ) : (
          <TagSearchQueryContainer>
            {tagSearchQueryHashMap.get(tagSearchInput) &&
              tagSearchQueryHashMap.get(tagSearchInput)?.map((value, key) => (
                <TagSearchQueryItem
                  key={key}
                  onClick={() => onClickTagSearchQuery(value)}
                >
                  {value}
                </TagSearchQueryItem>
              ))}
          </TagSearchQueryContainer>
        )}
      </SearchButtonInputHeaderContainer>
      <SelectedTagListContainer ref={tagListRef}>
        {tagList.map((value, key) => (
          <PostComposeTagWrap key={key}>
            <BorderCircleButton
              className={ACTIVE_CLASS_NAME}
              contentText={value}
              activeBackgroundColor={theme.mainColor.Blue}
              activeBorderColor={theme.mainColor.Blue}
              activeFontColor={theme.mainColor.White}
            />
            <PostComposeTagDeleteWrap
              onClick={() => {
                setTagList((prev) =>
                  prev.filter((preValue) => preValue !== value),
                );
              }}
            >
              <PostComposeTagDeleteButtonIcon />
            </PostComposeTagDeleteWrap>
          </PostComposeTagWrap>
        ))}
      </SelectedTagListContainer>
    </PopupLayout>
  );
};

const PopupWrapStyle: React.CSSProperties = {
  height: '85%',
};

const LoadingBarSize = '50px';

const SearchButtonInputHeaderContainer = styled.div`
  margin-top: 50px;
  flex: 1;
`;

const PostComposeSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
  width: 100%;
`;

const SearchLoadingWrap = styled.div`
  position: fixed;
  top: calc(30%);
  left: 50%;
  transform: translate(-50%, 50%);
`;

const SearchLoadingGif = styled.img`
  width: ${LoadingBarSize};
  height: ${LoadingBarSize};
`;

const TagSearchQueryContainer = styled.div`
  margin-top: calc(${({ theme }) => theme.systemSize.header.height} + 20px);
  display: flex;
  flex-flow: column;
  gap: 20px;
`;

const TagSearchQueryItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  padding-left: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
`;

const SelectedTagListContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    30px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const PostComposeTagWrap = styled.div`
  position: relative;
`;

const PostComposeTagDeleteWrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export default TagSearchPopup;
