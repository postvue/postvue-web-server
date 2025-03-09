import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { MEDIA_MIDDLE_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
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
  const { windowWidth } = useWindowSize();
  return (
    <BottomNextButton
      title={'필로그 시작하러가기'}
      notActiveTitle={'필로그 시작하러가기'}
      isActive={isActive}
      hasNotActiveElement={true}
      isTransparent={true}
      actionFunc={actionFunc}
      BottomNextButtonWrapContainerStyle={{
        position: windowWidth <= MEDIA_MIDDLE_WIDTH_NUM ? 'static' : 'absolute',
        maxWidth: theme.systemSize.appDisplaySize.maxWidth,
      }}
    />
  );
};

export default SignupCompleteButton;
