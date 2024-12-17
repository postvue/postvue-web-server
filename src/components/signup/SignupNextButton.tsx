import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE } from 'const/SignupConst';
import React from 'react';
import { useRecoilState } from 'recoil';
import { signupStepNumAtom } from 'states/SignupAtom';
import theme from 'styles/theme';

interface SignupNextButtonProps {
  isActive: boolean;
}

const SignupNextButton: React.FC<SignupNextButtonProps> = ({ isActive }) => {
  const [signupStepNum, setSignupStepNum] = useRecoilState(signupStepNumAtom);
  return (
    <BottomNextButton
      title={'다음'}
      notActiveTitle={'다음'}
      isActive={isActive}
      hasNotActiveElement={true}
      isTransparent={true}
      actionFunc={() => {
        if (signupStepNum <= SIGNUP_FAVORITE_TAG_INPUT_STEP_VALUE) {
          setSignupStepNum(signupStepNum + 1);
        }
      }}
      BottomNextButtonWrapContainerStyle={{
        position: 'fixed',
        maxWidth: theme.systemSize.appDisplaySize.maxWidth,
      }}
    />
  );
};

export default SignupNextButton;
