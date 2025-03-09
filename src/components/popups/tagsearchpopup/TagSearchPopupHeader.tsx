import SearchButtonInput from 'components/common/input/SearchButtonInput';
import HeaderLayout from 'components/layouts/HeaderLayout';
import { TAG_SEARCH_PHASE_TEXT } from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidString } from 'global/util/ValidUtil';
import React from 'react';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { getTagSearchQuery } from 'services/search/getTagSearchQuery';
import { tagSearchInputAtom } from 'states/TagAtom';
import styled from 'styled-components';

interface TagSearchPopupHeaderProps {
  tagSearchInputRef: React.RefObject<HTMLInputElement>;
  tagSearchQueryHashMap: Map<string, string[]>;
  setTagSearchQueryHashMap: SetterOrUpdater<Map<string, string[]>>;
  onSearchInputDelete: () => void;
  tagSearchInput: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  saveTagToList: (searchQuery: string) => void;
  onClose: () => void;
  TagTitleStyle?: React.CSSProperties;
  TagInputHeaderStyle?: React.CSSProperties;
}

const TagSearchPopupHeader: React.FC<TagSearchPopupHeaderProps> = ({
  tagSearchInputRef,
  tagSearchQueryHashMap,
  setTagSearchQueryHashMap,
  onSearchInputDelete,
  tagSearchInput,
  setLoading,
  saveTagToList,
  onClose,
  TagTitleStyle,
  TagInputHeaderStyle,
}) => {
  const setTagSearchInput = useSetRecoilState(tagSearchInputAtom);

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setLoading(true);
    if (isValidString(word)) {
      debouncedGetSearchQuery(word);
    }
    setTagSearchInput(event.target.value);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === 'Enter' &&
      event.nativeEvent.isComposing === false &&
      isValidString(tagSearchInput)
    ) {
      // tagSearchInputRef.current?.blur();
      saveTagToList(tagSearchInput);
      onSearchInputDelete();
    }
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
  return (
    <>
      <PostComposeTagTitle style={TagTitleStyle}>
        <TagPopupTitleHeaderTitle>태그</TagPopupTitleHeaderTitle>
        <TagPopupCloseButton
          onClick={() => {
            onClose();
          }}
        >
          닫기
        </TagPopupCloseButton>
      </PostComposeTagTitle>
      <HeaderLayout
        HeaderLayoutStyle={{
          ...TagInputHeaderStyle,
          ...{ position: 'static' },
        }}
        isInsetTopMatin={false}
      >
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
    </>
  );
};

const TagSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 10px;
  width: 100%;
`;

const PostComposeTagTitle = styled.div`
  width: 100%;
  position: relative;
  height: ${({ theme }) => theme.systemSize.header.height};
`;

const TagPopupTitleHeaderTitle = styled.div`
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;

  margin: auto;

  font: ${({ theme }) => theme.fontSizes.Headline1};
`;

const TagPopupCloseButton = styled.div`
  position: absolute;
  font: ${({ theme }) => theme.fontSizes.Body4};
  right: 0px;
  transform: translate(0, 50%);
  cursor: pointer;
  margin-right: ${({ theme }) =>
    theme.systemSize.appDisplaySize.bothSidePadding};
  z-index: 100;
`;

export default TagSearchPopupHeader;
