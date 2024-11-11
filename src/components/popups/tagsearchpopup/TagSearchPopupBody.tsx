import { ReactComponent as PostComposeTagDeleteButtonIcon } from 'assets/images/icon/svg/PostComposeTagDeleteButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import LoadingComponent from 'components/common/container/LoadingComponent';
import SearchButtonInput from 'components/common/input/SearchButtonInput';
import HeaderLayout from 'components/layouts/HeaderLayout';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { TAG_SEARCH_PHASE_TEXT } from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getTagSearchQuery } from 'services/search/getTagSearchQuery';
import { tagSearchInputAtom, tagSearchQueryHashMapAtom } from 'states/TagAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface TagSearchPopupBodyProps {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagSearchPopupBody: React.FC<TagSearchPopupBodyProps> = ({
  tagList,
  setTagList,
}) => {
  const tagListRef = useRef<HTMLDivElement>(null);
  const tagSearchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

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

  const TagSearchContainerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <TagSearchContainer ref={TagSearchContainerRef}>
        <HeaderLayout HeaderLayoutStyle={{ position: 'absolute' }}>
          <TagSearchInputWrap>
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
          </TagSearchInputWrap>
        </HeaderLayout>
        {loading ? (
          <LoadingComponent />
        ) : (
          <TagSearchQueryContainer
            $height={TagSearchContainerRef.current?.offsetHeight}
          >
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
      </TagSearchContainer>
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
    </>
  );
};

const TagSearchContainer = styled.div`
  margin-top: 30px;
  flex: 1;
`;

const TagSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
  width: 100%;
`;

const TagSearchQueryContainer = styled.div<{ $height: number | undefined }>`
  margin-top: calc(${({ theme }) => theme.systemSize.header.height} + 20px);
  display: flex;
  flex-flow: column;
  gap: 20px;
  overflow-y: scroll;
  height: ${(props) =>
    props.$height &&
    props.$height - 80 - theme.systemSize.header.heightNumber}px;
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

export default TagSearchPopupBody;
