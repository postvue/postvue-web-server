import { ProfileMyInfo } from 'global/interface/profile';
import { QueryStateMyProfileInfo } from 'hook/queryhook/QueryStateMyProfileInfo';
import React, { useEffect } from 'react';
import {
  getMyAccountSettingInfo,
  initMyAccountSettingInfo,
} from '../../../global/util/MyAccountSettingUtil';

const MyAccountSettingInfoState: React.FC = () => {
  const { data } = QueryStateMyProfileInfo();

  function areObjectsEqual(obj1: ProfileMyInfo, obj2: ProfileMyInfo): boolean {
    const keys = Object.keys(obj1) as (keyof ProfileMyInfo)[];

    // obj1의 모든 속성을 반복합니다.
    for (const key of keys) {
      // obj2에 속성이 없거나 값이 다르면 false 반환
      if (!(key in obj2) || obj1[key] !== obj2[key]) {
        return false;
      }
    }

    // 모든 속성이 같으면 true 반환
    return true;
  }

  useEffect(() => {
    const sessionMyAccountSettingInfo: ProfileMyInfo =
      getMyAccountSettingInfo();

    if (data && !areObjectsEqual(sessionMyAccountSettingInfo, data)) {
      initMyAccountSettingInfo(data);
    }
  }, [data]);
  return <></>;
};

export default MyAccountSettingInfoState;
