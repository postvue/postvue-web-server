import BottomNextButton from 'components/common/buttton/BottomNextButton';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
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
      title={`${APP_SERVICE_NAME} 시작하기`}
      notActiveTitle={`${APP_SERVICE_NAME} 시작하기`}
      isActive={isActive}
      hasNotActiveElement={true}
      isTransparent={true}
      actionFunc={actionFunc}
      BottomNextButtonWrapContainerStyle={{
        position: windowWidth <= MEDIA_MIDDLE_WIDTH_NUM ? 'static' : 'absolute',
        maxWidth: theme.systemSize.appDisplaySize.maxWidth,
        marginBottom: 'env(safe-area-inset-bottom)',
      }}
    />
  );
};

export default SignupCompleteButton;
