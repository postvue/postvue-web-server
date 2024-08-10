import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  HOME_PATH,
  MESSAGE_CONVERSTAION_PATH,
  MESSAGE_INBOX_PATH,
  PROFILE_POST_LIST_PATH,
  SEARCH_PATH,
  SEARCH_POST_PATH,
} from './const/PathConst';
import HomePage from './pages/HomePage';
import MessageConversationPage from './pages/MessageConversationPage';
import MessageInboxPage from './pages/MessageInboxPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import SearchPostPage from './pages/SearchPostPage';

const AppRouter: React.FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PATH} element={<HomePage />} />
        <Route path={PROFILE_POST_LIST_PATH} element={<ProfilePage />} />
        <Route path={SEARCH_PATH} element={<SearchPage />} />
        <Route path={SEARCH_POST_PATH} element={<SearchPostPage />} />
        <Route path={MESSAGE_INBOX_PATH} element={<MessageInboxPage />} />
        <Route
          path={MESSAGE_CONVERSTAION_PATH}
          element={<MessageConversationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
