import BottomNextButton from 'components/common/buttton/BottomNextButton';
import React from 'react';
import theme from 'styles/theme';

interface SignupCompleteButtonProps {
  isActive: boolean;
  actionFunc: () => void;
}

const SignupCompleteButton: React.FC<SignupCompleteButtonProps> = ({
  isActive,
  actionFunc,
}) => {
  return (
    <BottomNextButton
      title={'필로그 시작하러가기'}
      notActiveTitle={'필로그 시작하러가기'}
      isActive={isActive}
      hasNotActiveElement={true}
      isTransparent={true}
      actionFunc={actionFunc}
      BottomNextButtonWrapContainerStyle={{
        position: 'fixed',
        maxWidth: theme.systemSize.appDisplaySize.maxWidth,
      }}
    />
  );
};

export default SignupCompleteButton;
