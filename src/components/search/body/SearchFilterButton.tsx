import { ReactComponent as PostSearchSettingButtonIcon } from 'assets/images/icon/svg/SettingHorizontalDotIcon.svg';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveSearchPostFilterPopupAtom } from 'states/SearchPostAtom';
import styled from 'styled-components';

const SearchFilterButton: React.FC = () => {
  const setIsActiveSearchPostFilterPopup = useSetRecoilState(
    isActiveSearchPostFilterPopupAtom,
  );

  return (
    <SearchFilterButtonWrap
      onClick={() => {
        console.log('헤잇');
        setIsActiveSearchPostFilterPopup(true);
      }}
    >
      <SearchFilterSubButton>
        <PostSearchSettingButtonIcon />
      </SearchFilterSubButton>
    </SearchFilterButtonWrap>
  );
};

const SearchFilterButtonWrap = styled.div`
  margin: auto 10px auto 0px;
  display: flex;
`;

const SearchFilterSubButton = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.grey.Grey2};
`;
export default SearchFilterButton;
