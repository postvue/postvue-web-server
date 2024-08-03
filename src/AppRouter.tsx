import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HOME_PATH, PROFILE_POST_LIST_PATH } from './const/PathConst';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const AppRouter: React.FC = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PATH} element={<HomePage />} />
        <Route path={PROFILE_POST_LIST_PATH} element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
