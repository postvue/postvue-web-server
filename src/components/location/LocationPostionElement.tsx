import React from 'react';
import styled from 'styled-components';

interface LocationPositionElementProps {
  onClickAddress: () => void;

  buildName: string;
  roadAddr: string;
}

const LocationPositionElement: React.FC<LocationPositionElementProps> = ({
  onClickAddress,

  buildName,
  roadAddr,
}) => {
  return (
    <LocatoinPositionWrap onClick={onClickAddress}>
      <LocatoinPositionBuildName>{buildName}</LocatoinPositionBuildName>
      <LocatoinPositionRoadAddr>{roadAddr}</LocatoinPositionRoadAddr>
    </LocatoinPositionWrap>
  );
};

const LocatoinPositionWrap = styled.div`
  cursor: pointer;
`;

const LocatoinPositionBuildName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
`;

const LocatoinPositionRoadAddr = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey7};
`;

export default LocationPositionElement;
