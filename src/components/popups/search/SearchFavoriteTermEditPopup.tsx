import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import SearchFavoriteTermEditBody from 'components/search/body/SearchFavoriteTermEditBody';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { isActiveSearchFavoritePopupAtom } from 'states/SearchPostAtom';

const SearchFavoriteTermEditPopup: React.FC = () => {
  const setIsActiveSearchFavoritePopup = useSetRecoilState(
    isActiveSearchFavoritePopupAtom,
  );

  return (
    <RoundSquareCenterPopupLayout
      onClose={() => setIsActiveSearchFavoritePopup(false)}
      popupOverLayContainerStyle={{ zIndex: '2000' }}
    >
      <SearchFavoriteTermEditBody
        SearchFavoriteTermEditContainerStyle={{
          overflow: 'scroll',
          marginBottom: '20px',
        }}
        onClose={() => {
          setIsActiveSearchFavoritePopup(false);
        }}
      />
    </RoundSquareCenterPopupLayout>
  );
};

export default SearchFavoriteTermEditPopup;
