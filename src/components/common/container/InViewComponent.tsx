import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import React from 'react';
import styled from 'styled-components';

interface InViewComponentProps {
  inViewRef?: (node?: Element | null) => void;
}

const InViewComponent: React.FC<InViewComponentProps> = ({ inViewRef }) => {
  return <InViewComponentWrap ref={inViewRef} />;
};

const InViewComponentWrap = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-bottom: 86px;
  }
`;

export default InViewComponent;
