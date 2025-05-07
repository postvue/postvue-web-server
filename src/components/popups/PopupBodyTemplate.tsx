import React from 'react';
import styled from 'styled-components';
import PopupBodyButton from './PopupBodyButton';

interface ElementType {
  title?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onFunc: () => void;
}

interface PopupBodyProps {
  elementList: ElementType[];
}

const PopupBodyTemplate: React.FC<PopupBodyProps> = ({ elementList }) => {
  return (
    <PostSettingPopupBodyContainer>
      <PostSettingContextWrap>
        {elementList.map((v, i) => (
          <PopupBodyButton
            key={i}
            title={v.title}
            Icon={v.Icon}
            onFunc={v.onFunc}
          />
        ))}
      </PostSettingContextWrap>
    </PostSettingPopupBodyContainer>
  );
};

const PostSettingPopupBodyContainer = styled.div`
  position: relative;
  flex-shrink: 1;
`;

const PostSettingContextWrap = styled.div`
  padding: 5px 15px;
  display: flex;
  flex-flow: column;
  gap: 8px;
`;

export default PopupBodyTemplate;
