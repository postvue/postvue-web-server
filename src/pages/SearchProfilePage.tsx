import React from 'react';

import SearchHeader from 'components/search/header/SearchHeader';
import { useRecoilValue } from 'recoil';
import { SEARCH_PATH } from 'services/appApiPath';
import {
  isActiveSearchPostFilterPopupAtom,
  searchWordAtom,
} from 'states/SearchPostAtom';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import PostSearchFilterPopup from 'components/popups/search/PostSearchFilterPopup';
import SearchProfileBody from 'components/search/body/SearchProfileBody';
import { SEARCH_PROFILE_PATH } from 'const/PathConst';
import { handleMessageByRouteAndMoveUrl } from 'global/native/nativeHandleMessage';
import { useMessageListener } from 'hook/customhook/useMessageListener';
import { useNavigate } from 'react-router-dom';

const SearchProfilePage: React.FC = () => {
  const isActiveSearchPostFilterPopup = useRecoilValue(
    isActiveSearchPostFilterPopupAtom,
  );

  const searchWord = useRecoilValue(searchWordAtom);

  const navigate = useNavigate();

  useMessageListener((event) => {
    handleMessageByRouteAndMoveUrl(event, (url: string) => {
      navigate(url, { replace: true });
    });
  });

  return (
    <>
      <PageHelmentInfoElement
        title={searchWord}
        ogTitle={searchWord}
        ogUrl={window.location.href}
        ogDescription={searchWord}
      />
      <AppBaseTemplate
        hasSearchInputModule={false}
        isDisplayFavoriteTerm={false}
        SideContainerStyle={{
          height: '100dvh',
        }}
        SideSearchBodyWrapStyle={{ top: '10px' }}
        hasPostSearchFilterPopupBody={true}
      >
        <SearchHeader
          searchUrl={SEARCH_PROFILE_PATH}
          backToUrl={SEARCH_PATH}
          isShowFavoriteTermButton={false}
        />

        <SearchProfileBody />

        {isActiveSearchPostFilterPopup && (
          <PostSearchFilterPopup searchWord={searchWord} />
        )}
        <BottomNavBar />
      </AppBaseTemplate>
    </>
  );
};

export default SearchProfilePage;
