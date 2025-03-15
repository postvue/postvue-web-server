import { ACCESS_TOKEN, INVALID_ACCESS_TOKEN } from 'const/LocalStorageConst';
import { SERVICE_USAGE_TIME } from 'const/SystemAttrConst';
import { getAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import { useLocalStorageListener } from 'hook/customhook/useLocalStorageLister';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { getCheckMe } from 'services/auth/getCheckMe';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';

const ServiceUsageTimerConfig: React.FC = () => {
  const setServiceUsageTimerState = useSetRecoilState(
    serviceUsageTimerStateAtom,
  );

  const accessToken = useLocalStorageListener(ACCESS_TOKEN);
  useEffect(() => {
    if (isApp()) return;
    // const accessToken = getAccessTokenToLocalStorage();

    async function checkAccessToken() {
      if (accessToken && isValidString(accessToken) && (await getCheckMe())) {
        setServiceUsageTimerState(false);
        return;
      }

      // @REFER: 나중에 추가 window.location.pathname.startsWith(SIGNUP_PATH)
      setTimeout(() => {
        const accessToken = getAccessTokenToLocalStorage();
        if (
          isValidString(accessToken) &&
          accessToken !== INVALID_ACCESS_TOKEN
        ) {
          setServiceUsageTimerState(false);
          return;
        } else {
          setServiceUsageTimerState(true);
        }
      }, SERVICE_USAGE_TIME);
    }

    checkAccessToken();
  }, [accessToken]);
  return <></>;
};

export default ServiceUsageTimerConfig;
