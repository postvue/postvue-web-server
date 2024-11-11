import BottomNextButton from 'components/common/buttton/BottomNextButton';
import React from 'react';
interface PostComposeButtonProps {
  title: string;
  notActiveTitle?: string;
  bottomNextButtonRef: React.RefObject<HTMLDivElement>;
  onClickActionFunc: () => void;
  isActive: boolean;
}

const PostComposeButton: React.FC<PostComposeButtonProps> = ({
  title,
  notActiveTitle,
  bottomNextButtonRef,
  onClickActionFunc,
  isActive,
}) => {
  return (
    <BottomNextButton
      title={title}
      notActiveTitle={notActiveTitle ? notActiveTitle : title}
      isTransparent={true}
      bottomNextButtonRef={bottomNextButtonRef}
      actionFunc={onClickActionFunc}
      isActive={isActive}
    />
  );
};

export default PostComposeButton;
