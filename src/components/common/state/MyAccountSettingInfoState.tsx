import { ProfileMyInfo } from 'global/interface/profile';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { INIT_MY_ACCOUNT_STRING_VALUE } from '../../../const/LocalStorageConst';
import {
  getMyAccountSettingInfo,
  initMyAccountSettingInfo,
} from '../../../global/util/MyAccountSettingUtil';
import { getMyProfileInfo } from '../../../services/profile/getMyProfileInfo';
import { myProfileSettingInfoAtom } from '../../../states/ProfileAtom';

const MyAccountSettingInfoState: React.FC = () => {
  const setMyAccountSettingInfo = useSetRecoilState(myProfileSettingInfoAtom);

  useEffect(() => {
    const sessionMyAccountSettingInfo: ProfileMyInfo =
      getMyAccountSettingInfo();

    if (sessionMyAccountSettingInfo.userId === INIT_MY_ACCOUNT_STRING_VALUE) {
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
