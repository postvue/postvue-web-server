import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';

interface ToggleProps {
  width?: number; // 버튼의 너비를 외부에서 정의할 수 있음
  height?: number; // 버튼의 높이를 외부에서 정의할 수 있음
  backgroundColor?: string;
  isActive?: boolean;
  actionFunc?: (isActive: boolean) => void;
}

const ToggleSwitchButton: React.FC<ToggleProps> = ({
  width = 40,
  height = 24,
  backgroundColor = theme.mainColor.Black,
  isActive = false,
  actionFunc,
}) => {
  const [toggled, setToggled] = useState(false);

  const handleToggle = () => {
    if (actionFunc) {
      actionFunc(toggled);
    }
  };

  useEffect(() => {
    setToggled(isActive);
  }, [isActive]);

  return (
    <ToggleContainer
      $backgroundColor={backgroundColor}
      $toggled={toggled}
      $width={width}
      $height={height}
      onClick={handleToggle}
    >
      <ToggleCircle toggled={toggled} width={width} height={height} />
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div<{
  $toggled: boolean;
  $width: number;
  $height: number;
  $backgroundColor: string;
}>`
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  background-color: ${(props) =>
    props.$toggled ? props.$backgroundColor : theme.grey.Grey2};
  border-radius: ${(props) => props.$height}px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
`;

theme.mainColor.White;

const ToggleCircle = styled.div<{
  toggled: boolean;
  width: number;
  height: number;
}>`
  width: ${(props) => props.height - 4}px;
  height: ${(props) => props.height - 4}px;
  background-color: ${({ theme }) => theme.mainColor.White};
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: ${(props) =>
    props.toggled ? `${props.width - props.height + 2}px` : '2px'};
  transition: left 0.2s;
`;

export default ToggleSwitchButton;
