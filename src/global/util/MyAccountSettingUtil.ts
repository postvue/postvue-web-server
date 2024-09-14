import {
  INIT_MY_ACCOUNT_STRING_VALUE,
  MY_ACCOUNT_SETTING_INFO,
} from '../../const/LocalStorageConst';
import { MyAccountSettingInterface } from '../interface/localstorage/MyAccountSettingInterface';

export const getMyAccountSettingInfo = (): MyAccountSettingInterface => {
  const initMyAccount: MyAccountSettingInterface = {
    userId: INIT_MY_ACCOUNT_STRING_VALUE,
    username: INIT_MY_ACCOUNT_STRING_VALUE,
    profilePath: INIT_MY_ACCOUNT_STRING_VALUE,
  };

  const myAccountSettingInfo: MyAccountSettingInterface = JSON.parse(
    localStorage.getItem(MY_ACCOUNT_SETTING_INFO) ||
      JSON.stringify(initMyAccount),
  );
  return myAccountSettingInfo;
};

export const initMyAccountSettingInfo = (
  myAccountSettingInfoData: MyAccountSettingInterface,
): void => {
  localStorage.setItem(
    MY_ACCOUNT_SETTING_INFO,
    JSON.stringify(myAccountSettingInfoData),
  );
};

export const saveMyAccountProfileImg = (dataUri: string): void => {
  const myAccountSettingInfo = getMyAccountSettingInfo();
  myAccountSettingInfo.profilePath = dataUri;
  localStorage.setItem(
    MY_ACCOUNT_SETTING_INFO,
    JSON.stringify(myAccountSettingInfo),
  );
};
