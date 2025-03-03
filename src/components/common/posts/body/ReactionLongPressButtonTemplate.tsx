import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import React from 'react';

interface ReactionLongPressButtonTemplateProps {
  resize: number;
  resizeSpeedRate: number;
  children: React.ReactNode;
}

const ReactionLongPressButtonTemplate: React.FC<
  ReactionLongPressButtonTemplateProps
> = ({ resize, resizeSpeedRate, children }) => {
  return (
    <LongPressToResizeButton
      resize={resize}
      resizeSpeedRate={resizeSpeedRate}
      LongPressToResizeButtonContainerStyle={{
        display: 'flex',
        margin: 'auto 0',
      }}
    >
      {children}
    </LongPressToResizeButton>
  );
};

export default ReactionLongPressButtonTemplate;
