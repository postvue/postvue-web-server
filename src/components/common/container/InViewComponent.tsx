import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import LoadingComponent from './LoadingComponent';

interface InViewComponentProps {
  inViewRef?: (node?: Element | null) => void;
  inViewBottomNumByMobile?: number;
  inViewBottomNumByPc?: number;
  hasLoadingIcon?: boolean;
}

const InViewComponent: React.FC<InViewComponentProps> = ({
  inViewRef,
  inViewBottomNumByMobile = theme.systemSize.bottomNavBar.heightNum * 2,
  inViewBottomNumByPc = 100,
  hasLoadingIcon = false,
}) => {
  return (
    <InViewComponentWrap
      ref={inViewRef}
      $inViewBottomNumByMobile={inViewBottomNumByMobile}
      $inViewBottomNumByPc={inViewBottomNumByPc}
    >
      {hasLoadingIcon && (
        <LoadingComponent
          LoadingComponentStyle={{ top: '0', transform: 'translate(-50%, 0)' }}
        />
      )}
    </InViewComponentWrap>
  );
};

const InViewComponentWrap = styled.div<{
  $inViewBottomNumByMobile: number;
  $inViewBottomNumByPc: number;
}>`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: ${(props) => props.$inViewBottomNumByMobile}px;
    margin-bottom: 20px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    height: ${(props) => props.$inViewBottomNumByPc}px;
    margin-bottom: 20px;
  }
  position: relative;
`;

export default InViewComponent;
