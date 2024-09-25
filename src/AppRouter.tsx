import MyProfileEditPage from 'pages/MyProfileEditPage';
import PostComposePage from 'pages/PostComposePage';
import ProfileAccountSettingPage from 'pages/ProfileAccountSettingPage';
import ProfileFollowListPage from 'pages/ProfileFolllowListPage';
import SearchFavoriteTermEditPage from 'pages/SearchFavoriteTermEditPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  HOME_PATH,
  MESSAGE_CONVERSTAION_PATH,
  MESSAGE_INBOX_PATH,
  MSG_BLOCK_LIST_MANAGE_PATH,
  MSG_HIDDEN_LIST_MANAGE_PATH,
  POST_COMPOSE_PATH,
  PROFILE_ACCOUNT_PATH,
  PROFILE_CLIP_LIST_PATH,
  PROFILE_EDIT_PATH,
  PROFILE_FOLLOW_LIST_PATH,
  PROFILE_NEW_SCRAP_PATH,
  PROFILE_POST_LIST_PATH,
  PROFILE_SCRAP_LIST_PATH,
  PROFILE_SCRAP_PATH,
  PROFILE_SETTING_PATH,
  SEARCH_FAVORITE_LIST_PATH,
  SEARCH_PATH,
  SEARCH_POST_PATH,
} from './const/PathConst';
import HomePage from './pages/HomePage';
import MakeScrapPage from './pages/MakeScrapPage';
import MessageConversationPage from './pages/MessageConversationPage';
import MessageInboxPage from './pages/MessageInboxPage';
import MsgBlockListManagePage from './pages/MsgBlockListManagePage';
import MsgHiddenListManagePage from './pages/MsgHiddenListManagePage';
import MyProfileClipPage from './pages/MyProfileClipListPage';
import MyProfileScrap from './pages/MyProfileScrap';
import MyProfileScrapListPage from './pages/MyProfileScrapListPage';
import ProfileAccountPage from './pages/ProfileAccountPage';
import ProfilePostPage from './pages/ProfilePostPage';
import SearchPage from './pages/SearchPage';
import SearchPostPage from './pages/SearchPostPage';

const AppRouter: React.FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PATH} element={<HomePage />} />
        <Route path={PROFILE_POST_LIST_PATH} element={<ProfilePostPage />} />
        <Route path={SEARCH_PATH} element={<SearchPage />} />
        <Route path={SEARCH_POST_PATH} element={<SearchPostPage />} />
        <Route path={MESSAGE_INBOX_PATH} element={<MessageInboxPage />} />
        <Route
          path={MESSAGE_CONVERSTAION_PATH}
          element={<MessageConversationPage />}
        />
        <Route
          path={MESSAGE_CONVERSTAION_PATH}
          element={<MessageConversationPage />}
        />
        <Route path={PROFILE_CLIP_LIST_PATH} element={<MyProfileClipPage />} />
        <Route
          path={PROFILE_SCRAP_LIST_PATH}
          element={<MyProfileScrapListPage />}
        />
        <Route path={PROFILE_SCRAP_PATH} element={<MyProfileScrap />} />
        <Route path={PROFILE_NEW_SCRAP_PATH} element={<MakeScrapPage />} />
        <Route path={PROFILE_ACCOUNT_PATH} element={<ProfileAccountPage />} />
        <Route
          path={MSG_BLOCK_LIST_MANAGE_PATH}
          element={<MsgBlockListManagePage />}
        />
        <Route
          path={MSG_HIDDEN_LIST_MANAGE_PATH}
          element={<MsgHiddenListManagePage />}
        />
        <Route
          path={PROFILE_FOLLOW_LIST_PATH}
          element={<ProfileFollowListPage />}
        />

        <Route path={PROFILE_EDIT_PATH} element={<MyProfileEditPage />} />
        <Route
          path={PROFILE_SETTING_PATH}
          element={<ProfileAccountSettingPage />}
        />
        <Route path={POST_COMPOSE_PATH} element={<PostComposePage />} />
        <Route
          path={SEARCH_FAVORITE_LIST_PATH}
          element={<SearchFavoriteTermEditPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
