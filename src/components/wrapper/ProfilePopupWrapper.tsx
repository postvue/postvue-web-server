import { PROFILE_ACCOUNT_ROUTE_PATH } from 'const/PathConst';
import {
  FALSE_PARAM,
  PROFILE_POPUP_DISPLAY_PARAM,
  PROFILE_POPUP_PARAM,
  PROFILE_POPUP_USERNAME_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { sendPopupEvent } from 'global/util/reactnative/nativeRouter';
import { isValidString } from 'global/util/ValidUtil';
import React, { useEffect } from 'react';
import { generatePath, useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { profileDetailInfoPopupAtom } from 'states/ProfileAtom';

interface ProfilePopupWrapperProps {
  children: React.ReactNode;
}

const ProfilePopupWrapper: React.FC<ProfilePopupWrapperProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const setProfileDetailInfo = useSetRecoilState(profileDetailInfoPopupAtom);

  // URL 쿼리 매개변수 읽기

  useEffect(() => {
    const url = new URL(window.location.href); // location.href를 기반으로 URL 객체 생성
    const params = url.searchParams; // searchParams 객체 가져오기
    const isPopup = params.get(PROFILE_POPUP_PARAM) === TRUE_PARAM;
    const username = params.get(PROFILE_POPUP_USERNAME_PARAM);
    const display = params.get(PROFILE_POPUP_DISPLAY_PARAM) !== FALSE_PARAM;

    const referrer = document.referrer;

    if (
      location.key === 'default' &&
      (!referrer || !referrer.includes(window.location.hostname)) &&
      username !== null
    ) {
      const path = generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
        username: username,
      });
      navigate(path);
      return;
    }

    if (isPopup && username !== null && isValidString(username)) {
      setProfileDetailInfo({
        isActive: true,
        username: username,
        display: display,
      });

      sendPopupEvent(true);
    } else {
      setProfileDetailInfo({
        isActive: false,
        username: '',
        display: false,
      });

      sendPopupEvent(false);
    }
  }, [location]);
  return <div>{children}</div>;
};

export default ProfilePopupWrapper;
