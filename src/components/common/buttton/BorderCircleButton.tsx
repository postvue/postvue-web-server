import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface BorderCircleButtonProps {
  className: string;
  contentText: string;
  onClickFunc?: () => void;
  deactiveBackgroundColor?: string;
  deactiveBorderColor?: string;
  deactiveFontColor?: string;
  activeBackgroundColor?: string;
  activeBorderColor?: string;
  activeFontColor?: string;
}

const BorderCircleButton: React.FC<BorderCircleButtonProps> = ({
  className,
  contentText,
  onClickFunc,
  deactiveBackgroundColor,
  deactiveBorderColor,
  deactiveFontColor,
  activeBackgroundColor,
  activeBorderColor,
  activeFontColor,
}) => {
  return (
    <BorderCircleButtonContainer
      className={className}
      onClick={onClickFunc}
      $deactiveBackgroundColor={
        deactiveBackgroundColor || theme.mainColor.White
      }
      $deactiveBorderColor={deactiveBorderColor || theme.mainColor.White}
      $deactiveFontColor={deactiveFontColor || theme.mainColor.Black}
      $activeBackgroundColor={activeBackgroundColor || theme.mainColor.White}
      $activeBorderColor={activeBorderColor || theme.mainColor.White}
      $activeFontColor={activeFontColor || theme.mainColor.Black}
    >
      {contentText}
    </BorderCircleButtonContainer>
  );
};

const BorderCircleButtonContainer = styled.div<{
  $deactiveBackgroundColor: string;
  $deactiveBorderColor: string;
  $deactiveFontColor: string;
  $activeBackgroundColor: string;
  $activeBorderColor: string;
  $activeFontColor: string;
}>`
  display: inline-block;
  padding: 5px 12px;
  border-radius: 40px;
  font: ${({ theme }) => theme.fontSizes.Body2};
  cursor: pointer;

  background-color: ${(props) => props.$deactiveBackgroundColor};
  border: 1px solid ${(props) => props.$deactiveBorderColor};
  color: ${(props) => props.$deactiveFontColor};

  &.${ACTIVE_CLASS_NAME} {
    background-color: ${(props) => props.$activeBackgroundColor};
    border: 1px solid ${(props) => props.$activeBorderColor};
    color: ${(props) => props.$activeFontColor};
  }
`;

export default BorderCircleButton;
