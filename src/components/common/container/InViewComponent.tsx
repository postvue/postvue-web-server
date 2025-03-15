import TermContentComponent from 'components/TermContentComponent';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import LoadingComponent from './LoadingComponent';

interface InViewComponentProps {
  inViewRef?: (node?: Element | null) => void;
  inViewBottomNumByMobileHeight?: number;
  inViewBottomNumByMobileBottomMargin?: number;
  inViewBottomNumByPc?: number;
  hasLoadingIcon?: boolean;
  hasTermComponent?: boolean;
}

const InViewComponent: React.FC<InViewComponentProps> = ({
  inViewRef,
  inViewBottomNumByMobileHeight = theme.systemSize.bottomNavBar.heightNum,
  inViewBottomNumByMobileBottomMargin = theme.systemSize.bottomNavBar.heightNum,
  inViewBottomNumByPc = 100,
  hasLoadingIcon = false,
  hasTermComponent = false,
}) => {
  return (
    <>
      <InViewComponentWrap
        ref={inViewRef}
        $inViewBottomNumByMobileHeight={inViewBottomNumByMobileHeight}
        $inViewBottomNumByMobileBottomMargin={
          inViewBottomNumByMobileBottomMargin
        }
        $inViewBottomNumByPc={inViewBottomNumByPc}
      >
        {hasLoadingIcon && (
          <LoadingComponent
            LoadingComponentStyle={{
              top: '0',
              transform: 'translate(-50%, 0)',
            }}
          />
        )}
        {hasTermComponent && <TermContentComponent />}
      </InViewComponentWrap>
    </>
  );
};

const InViewComponentWrap = styled.div<{
  $inViewBottomNumByMobileHeight: number;
  $inViewBottomNumByMobileBottomMargin: number;
  $inViewBottomNumByPc: number;
}>`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: ${(props) => props.$inViewBottomNumByMobileHeight}px;
    margin-bottom: ${(props) =>
      props.$inViewBottomNumByMobileBottomMargin + 20}px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: ${(props) => props.$inViewBottomNumByPc}px;
    margin-bottom: 20px;
  }
  position: relative;
`;

export default InViewComponent;
