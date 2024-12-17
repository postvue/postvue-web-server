import AppBaseTemplate from 'components/layouts/AppBaseTemplate';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import SignupBody from 'components/signup/SignupBody';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';

import React, { useEffect } from 'react';
import { useResetRecoilState } from 'recoil';
import { signupStepNumAtom } from 'states/SignupAtom';

const SignupPage: React.FC = () => {
  const { windowWidth } = useWindowSize();
  const resetSignupStepNum = useResetRecoilState(signupStepNumAtom);

  useEffect(() => {
    resetSignupStepNum();
  }, []);
  return (
    <>
      {windowWidth >= MEDIA_MOBILE_MAX_WIDTH_NUM ? (
        <RoundSquareCenterPopupLayout
          onClose={() => {
            ('');
          }}
        >
          <SignupBody />
        </RoundSquareCenterPopupLayout>
      ) : (
        <AppBaseTemplate>
          <SignupBody />
        </AppBaseTemplate>
      )}{' '}
    </>
  );
};

export default SignupPage;
