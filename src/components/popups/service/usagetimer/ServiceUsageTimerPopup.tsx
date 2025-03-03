import BottomSheetNotScrollLayout from 'components/layouts/BottomSheetNotScrollLayout';
import RoundSquareCenterPopupLayout from 'components/layouts/RoundSquareCenterPopupLayout';
import useWindowSize from 'hook/customhook/useWindowSize';
import React from 'react';
import theme from 'styles/theme';
import ServiceUsageTimerPopupBody from './ServiceUsageTimerPopupBody';

const ServiceUsageTimerPopup: React.FC = () => {
  const { windowWidth } = useWindowSize();

  return (
    <>
      {windowWidth > theme.systemSize.appDisplaySize.maxWidthNum ? (
        <RoundSquareCenterPopupLayout
          onClose={() => ''}
          popupWrapStyle={{ height: '300px', width: '400px' }}
        >
          <ServiceUsageTimerPopupBody />
        </RoundSquareCenterPopupLayout>
      ) : (
        <BottomSheetNotScrollLayout
          onClose={() => ''}
          isOpen={true}
          hasCloseFunc={false}
          heightNum={
            280 +
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--safe-area-inset-bottom',
                ),
              ) || 0
          }
        >
          <ServiceUsageTimerPopupBody />
        </BottomSheetNotScrollLayout>
      )}
    </>
  );
};

export default ServiceUsageTimerPopup;
