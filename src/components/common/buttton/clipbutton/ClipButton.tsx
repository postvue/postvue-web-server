import anime from 'animejs';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { PostClipRsp } from '../../../../global/interface/post';
import { putPostClip } from '../../../../services/post/putPostClip';
import theme from '../../../../styles/theme';

interface ClipButtonProps {
  setClipStete: (postClipRsp: PostClipRsp) => void;
  postId: string;
  isClipped: boolean;
}

const ClipButton: React.FC<ClipButtonProps> = ({
  setClipStete,
  postId,
  isClipped,
}) => {
  const clipRef = useRef(null);

  const onClickClipButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (postId) {
      putPostClip(postId)
        .then((value) => {
          setClipStete(value);
          if (value.isClipped) {
            anime({
              targets: clipRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  return (
    <ClipButtonWrap onClick={(e) => onClickClipButton(e)}>
      <svg
        ref={clipRef}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isClipped ? theme.grey.Grey6 : 'none'}
      >
        <path
          d="M18 7V19.1315C18 19.9302 17.1099 20.4066 16.4453 19.9635L12 17L7.5547 19.9635C6.89014 20.4066 6 19.9302 6 19.1315V7C6 5.93913 6.42143 4.92172 7.17157 4.17157C7.92172 3.42143 8.93913 3 10 3H14C15.0609 3 16.0783 3.42143 16.8284 4.17157C17.5786 4.92172 18 5.93913 18 7Z"
          stroke={theme.grey.Grey6}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </ClipButtonWrap>
  );
};

const ClipButtonWrap = styled.div`
  cursor: pointer;
`;

export default ClipButton;
