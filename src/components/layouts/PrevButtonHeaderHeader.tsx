import React, { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import PrevButton from '../PrevButton';
import HeaderLayout from './HeaderLayout';

interface PrevButtonHeaderProps {
  titleName: string;
  RightButtonNode?: ReactNode;
  HeaderLayoutStyle?: React.CSSProperties;
}

const PrevButtonHeaderHeader: React.FC<PrevButtonHeaderProps> = ({
  titleName,
  RightButtonNode,
  HeaderLayoutStyle,
}) => {
  return (
    <HeaderLayout HeaderLayoutStyle={HeaderLayoutStyle}>
      <PrevButtonHeaderContainer>
        <PrevButtonHeaderHeaderWrap>
          <PrevButtonWrap>
            <PrevButton strokeColor={theme.mainColor.Black} />
          </PrevButtonWrap>
          <TitleName>{titleName}</TitleName>
          {RightButtonNode}
        </PrevButtonHeaderHeaderWrap>
      </PrevButtonHeaderContainer>
    </HeaderLayout>
  );
};

const PrevButtonHeaderContainer = styled.div`
  margin: auto 0;
  width: 100%;
  padding: 0 22px 0 15px;
`;

const PrevButtonHeaderHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PrevButtonWrap = styled.div`
  display: flex;
`;

const TitleName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  position: fixed;
  transform: translate(-50%, 0px);
  left: 50%;
`;

export default PrevButtonHeaderHeader;
