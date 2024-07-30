import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import { HOME_PATH } from './const/PathConst';
import HomePage from './pages/HomePage';

const AppRouter = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME_PATH} element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
