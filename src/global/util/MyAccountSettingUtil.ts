import { ProfileMyInfo } from 'global/interface/profile';
import {
  INIT_MY_ACCOUNT_STRING_VALUE,
  MY_ACCOUNT_SETTING_INFO,
} from '../../const/LocalStorageConst';

const initMyAccount: ProfileMyInfo = {
  userId: INIT_MY_ACCOUNT_STRING_VALUE,
  username: INIT_MY_ACCOUNT_STRING_VALUE,
  profilePath: INIT_MY_ACCOUNT_STRING_VALUE,
  nickname: INIT_MY_ACCOUNT_STRING_VALUE,
  introduce: INIT_MY_ACCOUNT_STRING_VALUE,
  website: INIT_MY_ACCOUNT_STRING_VALUE,
  email: INIT_MY_ACCOUNT_STRING_VALUE,
  birthdate: INIT_MY_ACCOUNT_STRING_VALUE,
  gender: INIT_MY_ACCOUNT_STRING_VALUE,
  isPrivateProfile: false,
};

// @REFER: QueryStateMyProfileInfo로 변경
// @ANSWER: 주석 처리함
// export const getMyAccountSettingInfo = (): ProfileMyInfo => {
//   const myAccountSettingInfo: ProfileMyInfo = JSON.parse(
//     localStorage.getItem(MY_ACCOUNT_SETTING_INFO) ||
//       JSON.stringify(initMyAccount),
//   );
//   return myAccountSettingInfo;
// };

// export const resetMyAccountSettingInfo = (): void => {
//   localStorage.setItem(MY_ACCOUNT_SETTING_INFO, JSON.stringify(initMyAccount));
// };

export const initMyAccountSettingInfo = (
  myAccountSettingInfoData: ProfileMyInfo,
): void => {
  localStorage.setItem(
    MY_ACCOUNT_SETTING_INFO,
    JSON.stringify(myAccountSettingInfoData),
  );
};

// export const saveMyAccountProfileImg = (dataUri: string): void => {
//   const myAccountSettingInfo = getMyAccountSettingInfo();
//   myAccountSettingInfo.profilePath = dataUri;
//   localStorage.setItem(
//     MY_ACCOUNT_SETTING_INFO,
//     JSON.stringify(myAccountSettingInfo),
//   );
// };
