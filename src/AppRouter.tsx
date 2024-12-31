import TestWrapper from 'components/TestWrapper';
import NativeMsgBridgeConfig from 'config/appconfig/NativeMsgBrigeConfig';

const EditScrapPage = React.lazy(() => import('pages/EditScrapPage'));
const LoginPage = React.lazy(() => import('pages/LoginPage'));
const MapExplorePage = React.lazy(() => import('pages/MapExplorePage'));
const MessageDirectConversationPage = React.lazy(
  () => import('pages/MessageDirectConversationPage'),
);
const NotificatinoPage = React.lazy(() => import('pages/NotificationPage'));
const PostComposePage = React.lazy(() => import('pages/PostComposePage'));
const PostEditPage = React.lazy(() => import('pages/PostEditPage'));
const ProfileAccountPasswordEditPage = React.lazy(
  () => import('pages/ProfileAccounPasswordEditPage'),
);
const ProfileAccountBirthdateEditPage = React.lazy(
  () => import('pages/ProfileAccountBirthdateEditPage'),
);
const ProfileAccountDeleteAccountPage = React.lazy(
  () => import('pages/ProfileAccountDeleteAccountPage'),
);
const ProfileAccountEmailEditPage = React.lazy(
  () => import('pages/ProfileAccountEmailEditPage'),
);
const ProfileAccountGenderEditPage = React.lazy(
  () => import('pages/ProfileAccountGenderEditPage'),
);
const ProfileAccountPrivateProfilePage = React.lazy(
  () => import('pages/ProfileAccountPrivateProfilePage'),
);
const ProfileAccountSettingEditPage = React.lazy(
  () => import('pages/ProfileAccountSettingEditPage'),
);
const ProfileAccountSettingManagePage = React.lazy(
  () => import('pages/ProfileAccountSettingManagePage'),
);
const ProfileAccountSettingPage = React.lazy(
  () => import('pages/ProfileAccountSettingPage'),
);
const ProfileAccountSettingPrivacyPage = React.lazy(
  () => import('pages/ProfileAccountSettingPrivacyPage'),
);
const ProfileBlockedUserListManagePage = React.lazy(
  () => import('pages/ProfileBlockedUserListManagePage'),
);
const ProfileFollowListPage = React.lazy(
  () => import('pages/ProfileFolllowListPage'),
);
const ProfilePostPage_ = React.lazy(() => import('pages/ProfilePostPage_'));
const ProfileScrapPage = React.lazy(() => import('pages/ProfileScrapPage'));
const SearchFavoriteTermEditPage = React.lazy(
  () => import('pages/SearchFavoriteTermEditPage'),
);
const SearchProfilePage = React.lazy(() => import('pages/SearchProfilePage'));
const SearchScrapPage = React.lazy(() => import('pages/SearchScrapPage'));
const SignupPage = React.lazy(() => import('pages/SignupPage'));
const SignupVerifyEmailPage = React.lazy(
  () => import('pages/SignupVerifyEmailPage'),
);

import LoadingComponent from 'components/common/container/LoadingComponent';
import { TRUE_PARAM } from 'const/QueryParamConst';
import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  EXPLORE_PATH,
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
  PROFILE_EDIT_SCRAP_ROUTE_PATH,
  PROFILE_EMAIL_EDIT_PATH,
  PROFILE_FOLLOW_LIST_PATH,
  PROFILE_GENDER_EDIT_PATH,
  PROFILE_MANAGE_PATH,
  PROFILE_NEW_SCRAP_PATH,
  PROFILE_PASSWORD_EDIT_PATH,
  PROFILE_POST_EDIT_PATH,
  PROFILE_POST_LIST_PATH,
  PROFILE_PRIVACY_POLICY_PATH,
  PROFILE_PRIVATE_PROFILE_PATH,
  PROFILE_SCRAP_LIST_PATH,
  PROFILE_SCRAP_PATH,
  PROFILE_SETTING_PATH,
  SEARCH_FAVORITE_LIST_PATH,
  SEARCH_PATH,
  SEARCH_POST_ROUTE_PATH,
  SEARCH_PROFILE_ROUTE_PATH,
  SEARCH_SCRAP_ROUTE_PATH,
  SIGNUP_PATH,
  VERIFY_EMAIL_PATH,
} from './const/PathConst';
const MakeScrapPage = React.lazy(() => import('./pages/MakeScrapPage'));
const MessageInboxPage = React.lazy(() => import('./pages/MessageInboxPage'));
const MsgBlockListManagePage = React.lazy(
  () => import('./pages/MsgBlockListManagePage'),
);
const MsgHiddenListManagePage = React.lazy(
  () => import('./pages/MsgHiddenListManagePage'),
);
const MyProfileClipPage = React.lazy(
  () => import('./pages/MyProfileClipListPage'),
);
const MyProfileScrapListPage = React.lazy(
  () => import('./pages/MyProfileScrapListPage'),
);
const ProfileAccountPage = React.lazy(
  () => import('./pages/ProfileAccountPage'),
);
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const SearchPostPage = React.lazy(() => import('./pages/SearchPostPage'));

const HomePage = React.lazy(() => import('./pages/HomePage'));

const AppRouter: React.FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      {/* <SplashWrapper> */}
      <TestWrapper>
        <NativeMsgBridgeConfig />
        <Suspense fallback={<LoadingComponent />}>
          <Routes>
            <Route path={HOME_PATH} element={<HomePage />} />
            <Route
              path={PROFILE_POST_LIST_PATH}
              element={<ProfilePostPage_ />}
            />
            <Route path={SEARCH_PATH} element={<SearchPage />} />
            <Route path={SEARCH_POST_ROUTE_PATH} element={<SearchPostPage />} />
            <Route
              path={SEARCH_PROFILE_ROUTE_PATH}
              element={<SearchProfilePage />}
            />
            <Route
              path={SEARCH_SCRAP_ROUTE_PATH}
              element={<SearchScrapPage />}
            />
            <Route path={MESSAGE_INBOX_PATH} element={<MessageInboxPage />} />
            <Route
              path={MESSAGE_CONVERSTAION_PATH}
              element={<MessageDirectConversationPage />}
            />
            <Route
              path={PROFILE_CLIP_LIST_PATH}
              element={<MyProfileClipPage />}
            />
            <Route
              path={PROFILE_SCRAP_LIST_PATH}
              element={<MyProfileScrapListPage />}
            />
            <Route path={PROFILE_SCRAP_PATH} element={<ProfileScrapPage />} />
            <Route path={PROFILE_NEW_SCRAP_PATH} element={<MakeScrapPage />} />
            <Route
              path={PROFILE_EDIT_SCRAP_ROUTE_PATH}
              element={<EditScrapPage />}
            />
            <Route
              path={PROFILE_ACCOUNT_PATH}
              element={<ProfileAccountPage />}
            />
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
            <Route
              path={NOTIFICATION_LIST_PATH}
              element={<NotificatinoPage />}
            />
            <Route path={EXPLORE_PATH} element={<MapExplorePage />} />
            <Route path={PROFILE_POST_EDIT_PATH} element={<PostEditPage />} />
            <Route
              path={VERIFY_EMAIL_PATH}
              element={<SignupVerifyEmailPage />}
            />

            <Route
              path="*"
              element={<Navigate to={`/?show_error=${TRUE_PARAM}`} replace />}
            />
          </Routes>
        </Suspense>
      </TestWrapper>
      {/* </SplashWrapper> */}
    </BrowserRouter>
  );
};

export default AppRouter;
