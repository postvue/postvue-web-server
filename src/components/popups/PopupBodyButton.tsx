import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import React from 'react';
import styled from 'styled-components';
import { filterBrigntnessStyle09 } from 'styles/commonStyles';

interface PopupBodyProps {
  title?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onFunc: () => void;
}

const PopupBodyButton: React.FC<PopupBodyProps> = ({ title, Icon, onFunc }) => {
  return (
    <LongPressToResizeButton>
      <PostSettingTab onClick={onFunc}>
        <PostSettingIconWrap>{Icon && <Icon />}</PostSettingIconWrap>
        <PostSettingTitle>{title}</PostSettingTitle>
      </PostSettingTab>
    </LongPressToResizeButton>
  );
};

const PostSettingTab = styled.div`
  padding: 8px 10px;
  display: flex;
  gap: 10px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.grey.Grey05};
  border-radius: 14px;
  ${filterBrigntnessStyle09}
`;

const PostSettingIconWrap = styled.div`
  display: flex;
  margin: auto 0px;
`;

const PostSettingTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  line-height: 200%;
  color: ${({ theme }) => theme.grey.Grey8};
`;

export default PopupBodyButton;
