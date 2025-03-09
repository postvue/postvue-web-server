import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE } from 'const/SignupConst';
import { MEDIA_MIDDLE_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import { useRecoilState } from 'recoil';
import {
  signStepTransitionInfoAtom,
  signupStepNumAtom,
} from 'states/SignupAtom';
import theme from 'styles/theme';

interface SignupNextButtonProps {
  isActive: boolean;
}

const SignupNextButton: React.FC<SignupNextButtonProps> = ({ isActive }) => {
  const [signupStepNum, setSignupStepNum] = useRecoilState(signupStepNumAtom);
  const [signStepTransitionInfo, setSignStepTransitionInfo] = useRecoilState(
    signStepTransitionInfoAtom,
  );

  const { windowWidth } = useWindowSize();
  return (
    <BottomNextButton
      title={'다음'}
      notActiveTitle={'다음'}
      isActive={isActive}
      hasNotActiveElement={true}
      isTransparent={true}
      actionFunc={() => {
        if (signupStepNum <= SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE) {
          setSignStepTransitionInfo({
            inTransition: true,
            direction: 'left',
          });
          setSignupStepNum(signupStepNum + 1);
        }
      }}
      BottomNextButtonWrapContainerStyle={{
        position: windowWidth <= MEDIA_MIDDLE_WIDTH_NUM ? 'static' : 'absolute',
        maxWidth: theme.systemSize.appDisplaySize.maxWidth,
      }}
    />
  );
};

export default SignupNextButton;
