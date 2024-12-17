import { ReactComponent as PostContentZoomExitButtonIcon } from 'assets/images/icon/svg/PostContentZoomExitButtonIcon.svg';
import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';
import { useResetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';

interface PostContentZoomPcPopupProps {
  currentIndex: number;
  contentLength: number;
  children: React.ReactNode;
  isActive: boolean;
}

const PostContentZoomPcPopup: React.FC<PostContentZoomPcPopupProps> = ({
  currentIndex,
  contentLength,
  children,
  isActive,
}) => {
  const resetPostContentZoomPopupInfo = useResetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = OVERFLOW_HIDDEN;
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

  return (
    <PopupOverLayLayoutContainer
      onClick={() => resetPostContentZoomPopupInfo()}
    >
      {contentLength > 1 && (
        <CurrentSlidePositionWrap>
          <CurrentSlidePosition>
            {currentIndex}/{contentLength}
          </CurrentSlidePosition>
        </CurrentSlidePositionWrap>
      )}
      <PostZoomExitButtonWrap>
        <PostContentZoomExitButtonIcon />
      </PostZoomExitButtonWrap>
      <PostContentWrap>{children}</PostContentWrap>
    </PopupOverLayLayoutContainer>
  );
};

const PopupOverLayLayoutContainer = styled.div`
  position: fixed;
  z-index: 1020;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: grab;

  background: rgba(0, 0, 0, 0.9);
`;

const PostZoomExitButtonWrap = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  margin: 10px 10px 0 0;
  z-index: 100;
  cursor: pointer;

  margin: 20px 20px 0 0;
`;

const PostContentWrap = styled.div`
  height: 100%;
  overflow-y: scroll;
  transform: none;
`;

const CurrentSlidePositionWrap = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 100;
`;

const CurrentSlidePosition = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey8};
  color: ${({ theme }) => theme.mainColor.White};
  display: inline-block;
  padding: 5px 8px;
  padding: 3px 7px;
  border-radius: 15px;
  font: ${({ theme }) => theme.fontSizes.Body1};
`;

export default PostContentZoomPcPopup;
