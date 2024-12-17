import React, { ReactNode } from 'react';
import styled from 'styled-components';
import theme from '../../styles/theme';
import PrevButton from '../PrevButton';
import HeaderLayout from './HeaderLayout';

interface PrevButtonHeaderProps {
  titleName?: string;
  hasTitleReactNode?: boolean;
  titleReactNode?: ReactNode;
  RightButtonNode?: ReactNode;
  HeaderLayoutStyle?: React.CSSProperties;
  isActionFunc?: boolean;
  preNodeByState?: ReactNode;
  actionFunc?: () => void;
}

const PrevButtonHeaderHeader: React.FC<PrevButtonHeaderProps> = ({
  titleName,
  hasTitleReactNode = false,
  RightButtonNode,
  HeaderLayoutStyle,
  isActionFunc = false,
  actionFunc,
  preNodeByState,
  titleReactNode,
}) => {
  return (
    <HeaderLayout HeaderLayoutStyle={HeaderLayoutStyle}>
      <PrevButtonHeaderContainer>
        <PrevButtonHeaderHeaderWrap>
          <PrevButtonWrap>
            {isActionFunc ? (
              <>
                <div onClick={actionFunc}>{preNodeByState}</div>
              </>
            ) : (
              <PrevButton strokeColor={theme.mainColor.Black} />
            )}
          </PrevButtonWrap>
          {titleName && <TitleName>{titleName}</TitleName>}
          {hasTitleReactNode && (
            <TitleReactNodeWrap>{titleReactNode}</TitleReactNodeWrap>
          )}
          {RightButtonNode}
        </PrevButtonHeaderHeaderWrap>
      </PrevButtonHeaderContainer>
    </HeaderLayout>
  );
};

const PrevButtonHeaderContainer = styled.div`
  margin: auto 0;
  width: 100%;
  padding: 0 ${({ theme }) => theme.systemSize.header.paddingLeftRightMargin} 0
    15px;
`;

const PrevButtonHeaderHeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const PrevButtonWrap = styled.div`
  display: flex;
`;

const TitleName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Headline1};
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
`;

const TitleReactNodeWrap = styled.div`
  position: absolute;
  transform: translate(-50%, 50%);

  left: 50%;
`;

export default PrevButtonHeaderHeader;
