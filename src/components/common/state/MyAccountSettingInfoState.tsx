import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { INIT_MY_ACCOUNT_STRING_VALUE } from '../../../const/LocalStorageConst';
import { MyAccountSettingInterface } from '../../../global/interface/localstorage/MyAccountSettingInterface';
import {
  getMyAccountSettingInfo,
  initMyAccountSettingInfo,
} from '../../../global/util/MyAccountSettingUtil';
import { getMyProfileInfo } from '../../../services/profile/getMyProfileInfo';
import { myProfileSettingInfoAtom } from '../../../states/ProfileAtom';

const MyAccountSettingInfoState: React.FC = () => {
  const setMyAccountSettingInfo = useSetRecoilState(myProfileSettingInfoAtom);

  useEffect(() => {
    const sessionMyAccountSettingInfo: MyAccountSettingInterface =
      getMyAccountSettingInfo();

    if (sessionMyAccountSettingInfo.myUserId === INIT_MY_ACCOUNT_STRING_VALUE) {
      getMyProfileInfo().then((myProfileInfo) => {
        initMyAccountSettingInfo(myProfileInfo);
        setMyAccountSettingInfo(myProfileInfo);
      });
    } else {
      setMyAccountSettingInfo(sessionMyAccountSettingInfo);
    }
  }, []);
  return <></>;
};

export default MyAccountSettingInfoState;
