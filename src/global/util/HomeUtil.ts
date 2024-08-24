import { HOME_HISTORY_LOCAL_STORAGE } from '../../const/LocalStorageConst';
import { TASTE_FOR_ME_TAB_ID } from '../../const/TabConfigConst';
import { HomeHistoryInterface } from '../interface/localstorage/HomeHistoryInterface';

export const getHomeHistory = (): HomeHistoryInterface => {
  const homeHistory: HomeHistoryInterface = JSON.parse(
    localStorage.getItem(HOME_HISTORY_LOCAL_STORAGE) ||
      JSON.stringify(initHomeHistory()),
  );
  return homeHistory;
};

export const initHomeHistory = (): HomeHistoryInterface => {
  const initHomeHistoryData: HomeHistoryInterface = {
    mainTabId: TASTE_FOR_ME_TAB_ID,
  };
  localStorage.setItem(
    HOME_HISTORY_LOCAL_STORAGE,
    JSON.stringify(initHomeHistoryData),
  );

  return initHomeHistoryData;
};

export const saveMainTabIdByHomeHistory = (mainTabId: number): void => {
  const homeHistory = getHomeHistory();
  homeHistory.mainTabId = mainTabId;
  localStorage.setItem(HOME_HISTORY_LOCAL_STORAGE, JSON.stringify(homeHistory));
};
