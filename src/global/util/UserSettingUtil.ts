import { USER_SETTING_SESSION } from '../../const/SessionStorageConst';
import { UserSettingInterface } from '../interface/sessionstorage/UserSettingInterface';

export const getUserSettingInfo = (): UserSettingInterface => {
  const initUserSettingInfo: UserSettingInterface = {
    currentInterestState: 0,
  };

  const userSettingInfo: UserSettingInterface = JSON.parse(
    sessionStorage.getItem(USER_SETTING_SESSION) ||
      JSON.stringify(initUserSettingInfo),
  );
  return userSettingInfo;
};

export const initUserSettingInfo = (
  userSettingInfo: UserSettingInterface,
): void => {
  sessionStorage.setItem(USER_SETTING_SESSION, JSON.stringify(userSettingInfo));
};

export const setCurrentIntertestByUserSettingInfo = (
  currentInterestState: number,
): UserSettingInterface => {
  const userSettingInfo: UserSettingInterface = getUserSettingInfo();
  userSettingInfo.currentInterestState = currentInterestState;
  sessionStorage.setItem(USER_SETTING_SESSION, JSON.stringify(userSettingInfo));

  return userSettingInfo;
};
