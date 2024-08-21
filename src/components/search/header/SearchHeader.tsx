import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import { NAVIGATION_TO } from '../../../const/AppConst';
import { INIT_EMPTY_STRING_VALUE } from '../../../const/AttributeConst';
import { SEARCH_PATH } from '../../../const/PathConst';
import { SEARCH_INPUT_PHARSE_TEXT } from '../../../const/SystemPhraseConst';
import { handleSearch } from '../../../global/util/SearchUtil';
import {
  cursorIdAtomBySearchPost,
  searchPostHashMapAtom,
  searchWordAtom,
} from '../../../states/SearchPostAtom';
import theme from '../../../styles/theme';
import PrevButton from '../../PrevButton';
import SearchButtonInput from '../../common/input/SearchButtonInput';

interface SearchHeaderProps {
  backToUrl: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ backToUrl }) => {
  const navigate = useNavigate();
  const param = useParams();
  const searchWordText = param.search_word;
  const [searchWord, setSearchWord] = useRecoilState(searchWordAtom);

  const [searchTempWord, setSearchTempWord] = useState<string>(searchWord);

  const resetCursorIdBySearchPost = useResetRecoilState(
    cursorIdAtomBySearchPost,
  );
  const resetSearchPostHashMap = useResetRecoilState(searchPostHashMapAtom);

  const isEmptyTermFunc = () => {
    setSearchTempWord('');
    const state = {};
    history.replaceState(state, '', location.pathname);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const word = event.target.value;
    setSearchTempWord(word);
    if (word === '') {
      isEmptyTermFunc();
    }
  };

  const onClickSearchButton = () => {
    if (searchTempWord !== '' && searchWord !== searchTempWord) {
      handleSearch(searchTempWord);
      resetCursorIdBySearchPost();
      resetSearchPostHashMap();
      setSearchWord(searchTempWord);
      navigate(`${SEARCH_PATH}/${searchTempWord}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onClickSearchButton();
    }
  };

  useEffect(() => {
    if (searchWordText) {
      setSearchWord(searchWordText);
      setSearchTempWord(searchWordText);
    }

    return () => {
      setSearchTempWord(INIT_EMPTY_STRING_VALUE);
    };
  }, []);

  return (
    <SearchContainer>
      <SearchContainerWrap>
        <PrevButtonWrap>
          <PrevButton
            style={PrevStyle}
            strokeColor={theme.mainColor.Black}
            to={backToUrl}
            type={NAVIGATION_TO}
          />
        </PrevButtonWrap>
        <SearchButtonInput
          placeholder={SEARCH_INPUT_PHARSE_TEXT}
          onSearchInputChange={handleChange}
          onSearchInputKeyDown={handleKeyPress}
          value={searchTempWord}
          onClickDelete={isEmptyTermFunc}
        />
      </SearchContainerWrap>
    </SearchContainer>
  );
};

const PrevButtonWrap = styled.div`
  display: flex;
`;
const PrevStyle: React.CSSProperties = {
  display: 'flex',
};

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10px;
`;

const SearchContainerWrap = styled.div`
  padding: 0 10px;
  display: flex;
  width: 100%;
`;

export default SearchHeader;
