import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import SearchFavoriteTermEditBody from 'components/search/body/SearchFavoriteTermEditBody';
import { HOME_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect } from 'react';

const SearchFavoriteTermEditPage: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);
  const { windowWidth } = useWindowSize();
  useEffect(() => {
    if (windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM) {
      goBackOrNavigate();
    }
  }, []);
  return (
    <AppBaseTemplate>
      <SearchFavoriteTermEditBody />
    </AppBaseTemplate>
  );
};

export default SearchFavoriteTermEditPage;
