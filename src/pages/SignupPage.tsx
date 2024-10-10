import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import SignupBirthdateGenderStep from 'components/signup/signstep/SignupBirthdateGenderStep';
import SignupFavoriteTagStep from 'components/signup/signstep/SignupFavoriteTagStep';
import SignupNicknameStep from 'components/signup/signstep/SignupNicknameStep';
import SignupTermOfServiceStep from 'components/signup/signstep/SignupTermOfServiceStep';
import SignupUsernameStep from 'components/signup/signstep/SignupUsernameStep';

import { SIGNUP_TYPE_COOKIE_NAME } from 'const/CookieConst';
import { LOGIN_PATH } from 'const/PathConst';
import {
  SIGNUP_BIRTHDATE_GENDER_INPUT_STEP_VALUE,
  SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE,
  SIGNUP_NICKNAME_INPUT_STEP_VALUE,
  SIGNUP_TERM_OF_SERVICE_STEP_VALUE,
  SIGNUP_USERNAME_INPUT_STEP_VALUE,
  SINGUP_GOOGLE_LOGIN_JOIN_TYPE,
  SINGUP_KAKAO_LOGIN_JOIN_TYPE,
  SINGUP_NAVER_LOGIN_JOIN_TYPE,
} from 'const/SignupConst';
import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { signupStepNumAtom } from 'states/SignupAtom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [signupStepNum, setSignupStepNum] = useRecoilState(signupStepNumAtom);

  const signupType = Cookies.get(SIGNUP_TYPE_COOKIE_NAME);

  const signupTypeList = [
    SINGUP_KAKAO_LOGIN_JOIN_TYPE,
    SINGUP_NAVER_LOGIN_JOIN_TYPE,
    SINGUP_GOOGLE_LOGIN_JOIN_TYPE,
  ];

  useEffect(() => {
    if (!signupType || !signupTypeList.includes(signupType)) {
      // 해당 가입이 유효하지 않음, 다시 로그인 필요
      navigate(LOGIN_PATH);
    }
  }, []);

  useEffect(() => {
    console.log(signupStepNum);
  }, [signupStepNum]);

  return (
    <AppBaseTemplate>
      {signupStepNum === SIGNUP_NICKNAME_INPUT_STEP_VALUE && (
        <SignupNicknameStep />
      )}
      {signupStepNum === SIGNUP_BIRTHDATE_GENDER_INPUT_STEP_VALUE && (
        <SignupBirthdateGenderStep />
      )}
      {signupStepNum === SIGNUP_USERNAME_INPUT_STEP_VALUE && (
        <SignupUsernameStep />
      )}
      {signupStepNum === SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE && (
        <SignupFavoriteTagStep />
      )}
      {signupStepNum === SIGNUP_TERM_OF_SERVICE_STEP_VALUE && (
        <SignupTermOfServiceStep />
      )}
    </AppBaseTemplate>
  );
};

export default SignupPage;
