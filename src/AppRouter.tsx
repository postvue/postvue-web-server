import LoginPage from 'pages/LoginPage';
import NotificatinoPage from 'pages/NotificationPage';
import PostComposePage from 'pages/PostComposePage';
import ProfileAccountPasswordEditPage from 'pages/ProfileAccounPasswordEditPage';
import ProfileAccountBirthdateEditPage from 'pages/ProfileAccountBirthdateEditPage';
import ProfileAccountDeleteAccountPage from 'pages/ProfileAccountDeleteAccountPage';
import ProfileAccountEmailEditPage from 'pages/ProfileAccountEmailEditPage';
import ProfileAccountGenderEditPage from 'pages/ProfileAccountGenderEditPage';
import ProfileAccountPrivateProfilePage from 'pages/ProfileAccountPrivateProfilePage';
import ProfileAccountSettingEditPage from 'pages/ProfileAccountSettingEditPage';
import ProfileAccountSettingManagePage from 'pages/ProfileAccountSettingManagePage';
import ProfileAccountSettingPage from 'pages/ProfileAccountSettingPage';
import ProfileAccountSettingPrivacyPage from 'pages/ProfileAccountSettingPrivacyPage';
import ProfileBlockedUserListManagePage from 'pages/ProfileBlockedUserListManagePage';
import ProfileFollowListPage from 'pages/ProfileFolllowListPage';
import SearchFavoriteTermEditPage from 'pages/SearchFavoriteTermEditPage';
import SignupPage from 'pages/SignupPage';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  HOME_PATH,
  LOGIN_PATH,
  MESSAGE_CONVERSTAION_PATH,
  MESSAGE_INBOX_PATH,
  MSG_BLOCK_LIST_MANAGE_PATH,
  MSG_HIDDEN_LIST_MANAGE_PATH,
  NOTIFICATION_LIST_PATH,
  POST_COMPOSE_PATH,
  PROFILE_ACCOUNT_PATH,
  PROFILE_BIRTHDATE_EDIT_PATH,
  PROFILE_BLOCKED_ACCOUNT_PATH,
  PROFILE_CLIP_LIST_PATH,
  PROFILE_DELETE_ACCOUNT_PATH,
  PROFILE_EDIT_PATH,
  PROFILE_EMAIL_EDIT_PATH,
  PROFILE_FOLLOW_LIST_PATH,
  PROFILE_GENDER_EDIT_PATH,
  PROFILE_MANAGE_PATH,
  PROFILE_NEW_SCRAP_PATH,
  PROFILE_PASSWORD_EDIT_PATH,
  PROFILE_POST_LIST_PATH,
  PROFILE_PRIVACY_POLICY_PATH,
  PROFILE_PRIVATE_PROFILE_PATH,
  PROFILE_SCRAP_LIST_PATH,
  PROFILE_SCRAP_PATH,
  PROFILE_SETTING_PATH,
  SEARCH_FAVORITE_LIST_PATH,
  SEARCH_PATH,
  SEARCH_POST_PATH,
  SIGNUP_PATH,
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
        <Route
          path={PROFILE_SETTING_PATH}
          element={<ProfileAccountSettingPage />}
        />
        <Route
          path={PROFILE_EDIT_PATH}
          element={<ProfileAccountSettingEditPage />}
        />
        <Route
          path={PROFILE_MANAGE_PATH}
          element={<ProfileAccountSettingManagePage />}
        />
        <Route
          path={PROFILE_EMAIL_EDIT_PATH}
          element={<ProfileAccountEmailEditPage />}
        />
        <Route
          path={PROFILE_BIRTHDATE_EDIT_PATH}
          element={<ProfileAccountBirthdateEditPage />}
        />
        <Route
          path={PROFILE_GENDER_EDIT_PATH}
          element={<ProfileAccountGenderEditPage />}
        />
        <Route
          path={PROFILE_PASSWORD_EDIT_PATH}
          element={<ProfileAccountPasswordEditPage />}
        />
        <Route
          path={PROFILE_DELETE_ACCOUNT_PATH}
          element={<ProfileAccountDeleteAccountPage />}
        />
        <Route
          path={PROFILE_PRIVACY_POLICY_PATH}
          element={<ProfileAccountSettingPrivacyPage />}
        />
        <Route
          path={PROFILE_PRIVATE_PROFILE_PATH}
          element={<ProfileAccountPrivateProfilePage />}
        />
        <Route
          path={PROFILE_BLOCKED_ACCOUNT_PATH}
          element={<ProfileBlockedUserListManagePage />}
        />
        <Route path={POST_COMPOSE_PATH} element={<PostComposePage />} />
        <Route
          path={SEARCH_FAVORITE_LIST_PATH}
          element={<SearchFavoriteTermEditPage />}
        />
        <Route path={LOGIN_PATH} element={<LoginPage />} />
        <Route path={SIGNUP_PATH} element={<SignupPage />} />

        <Route
          path={SEARCH_FAVORITE_LIST_PATH}
          element={<SearchFavoriteTermEditPage />}
        />

        <Route path={NOTIFICATION_LIST_PATH} element={<NotificatinoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
