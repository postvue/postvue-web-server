import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface InViewComponentProps {
  inViewRef?: (node?: Element | null) => void;
  inViewBottomNumByMobile?: number;
  inViewBottomNumByPc?: number;
}

const InViewComponent: React.FC<InViewComponentProps> = ({
  inViewRef,
  inViewBottomNumByMobile = theme.systemSize.bottomNavBar.heightNum,
  inViewBottomNumByPc = 20,
}) => {
  return (
    <InViewComponentWrap
      ref={inViewRef}
      $inViewBottomNumByMobile={inViewBottomNumByMobile}
      $inViewBottomNumByPc={inViewBottomNumByPc}
    />
  );
};

const InViewComponentWrap = styled.div<{
  $inViewBottomNumByMobile: number;
  $inViewBottomNumByPc: number;
}>`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-bottom: ${(props) => props.$inViewBottomNumByMobile}px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-bottom: ${(props) => props.$inViewBottomNumByPc}px;
  }
`;

export default InViewComponent;
