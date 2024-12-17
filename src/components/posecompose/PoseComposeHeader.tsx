import PrevButtonHeaderHeader from 'components/layouts/PrevButtonHeaderHeader';
import React from 'react';
import styled from 'styled-components';

interface PoseComposeHeaderProps {
  titleName: string;
  hasPrevButton?: boolean;
  actionFunc?: () => void;
}

const PoseComposeHeader: React.FC<PoseComposeHeaderProps> = ({
  titleName,
  hasPrevButton = true,
  actionFunc = () => {
    ('');
  },
}) => {
  return (
    <>
      <PrevButtonHeaderHeader
        titleName={titleName}
        HeaderLayoutStyle={{ backgroundColor: 'transparent' }}
        isActionFunc={!hasPrevButton}
        actionFunc={actionFunc}
        preNodeByState={<PreHeaderButtonNode>닫기</PreHeaderButtonNode>}
      />
    </>
  );
};

const PreHeaderButtonNode = styled.div`
  padding-left: 18px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  color: ${({ theme }) => theme.grey.Grey6};
  cursor: pointer;
`;

export default PoseComposeHeader;
