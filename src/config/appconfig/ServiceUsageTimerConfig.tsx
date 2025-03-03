import { INVALID_ACCESS_TOKEN } from 'const/LocalStorageConst';
import { SIGNUP_PATH } from 'const/PathConst';
import { SERVICE_USAGE_TIME } from 'const/SystemAttrConst';
import { getAccessTokenToLocalStorage } from 'global/util/CookieUtil';
import { isApp } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { serviceUsageTimerStateAtom } from 'states/SystemConfigAtom';

const ServiceUsageTimerConfig: React.FC = () => {
  const setServiceUsageTimerState = useSetRecoilState(
    serviceUsageTimerStateAtom,
  );
  useEffect(() => {
    if (isApp()) return;
    const accessToken = getAccessTokenToLocalStorage();

    if (isValidString(accessToken) && accessToken !== INVALID_ACCESS_TOKEN)
      return;

    setTimeout(() => {
      const accessToken = getAccessTokenToLocalStorage();
      if (
        (isValidString(accessToken) && accessToken !== INVALID_ACCESS_TOKEN) ||
        window.location.pathname.startsWith(SIGNUP_PATH)
      ) {
        setServiceUsageTimerState(false);
        return;
      } else {
        setServiceUsageTimerState(true);
      }
    }, SERVICE_USAGE_TIME);
  }, []);
  return <></>;
};

export default ServiceUsageTimerConfig;
