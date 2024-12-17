import SearchInputTemplate from 'components/common/input/SearchInputTemplate';
import HeaderLayout from 'components/layouts/HeaderLayout';
import { SNS_SHARE_USER_SEARCH_PHASE_TEXT } from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { isValidString } from 'global/util/ValidUtil';
import React, { useRef } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  isLoadingSearchSharePoupupAtom,
  isShareUserSearchInputActiveAtom,
  shareUserSearchTempWordAtom,
  shareUserSearchWordAtom,
} from 'states/ShareAtom';
import styled from 'styled-components';

interface SnsSharePopupHeaderProps {
  SnsSharePopupHeaderStyle?: React.CSSProperties;
}

const SnsSharePopupHeader: React.FC<SnsSharePopupHeaderProps> = ({
  SnsSharePopupHeaderStyle,
}) => {
  const shareSearchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const setShareUserSearchWord = useSetRecoilState(shareUserSearchWordAtom);
  const [shareUserSearchTempWord, setShareUserSearchTempWord] = useRecoilState(
    shareUserSearchTempWordAtom,
  );
  const [isShareUserSearchInputActive, setIsShareUserSearchInputActive] =
    useRecoilState(isShareUserSearchInputActiveAtom);
  const setLoading = useSetRecoilState(isLoadingSearchSharePoupupAtom);

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      if (!isValidString(word)) return;
      setLoading(true);
      setShareUserSearchWord(word);
      setLoading(false);
    },
    [],
    1000,
  );
  return (
    <HeaderLayout
      HeaderLayoutStyle={{
        ...SnsSharePopupHeaderStyle,
        ...{ position: 'static' },
      }}
    >
      <SnsShareSearchInputWrap>
        <SearchButtonInputWrap>
          <SearchInputTemplate
            searchInputRef={shareSearchInputRef}
            placeholder={SNS_SHARE_USER_SEARCH_PHASE_TEXT}
            debouncedGetSearchQuery={debouncedGetSearchQuery}
            setLoading={setLoading}
            searchTempWord={shareUserSearchTempWord}
            setSearchTempWord={setShareUserSearchTempWord}
            isSearchInputActive={isShareUserSearchInputActive}
            setIsSearchInputActive={setIsShareUserSearchInputActive}
          />
        </SearchButtonInputWrap>
      </SnsShareSearchInputWrap>
    </HeaderLayout>
  );
};

const SnsShareSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  width: 100%;
`;

export default SnsSharePopupHeader;
