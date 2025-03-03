import { ReactComponent as PostContentZoomExitButtonIcon } from 'assets/images/icon/svg/PostContentZoomExitButtonIcon.svg';
import { ReactComponent as LeftScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/LeftScrollXButton35x35Icon.svg';
import { ReactComponent as RightScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/RightScrollXButton35x35Icon.svg';
import { OVERFLOW_HIDDEN } from 'const/AttributeConst';
import React, { useEffect } from 'react';
import { useResetRecoilState } from 'recoil';
import { postContentZoomPopupInfoAtom } from 'states/PostAtom';
import styled from 'styled-components';

interface PostContentZoomPcPopupProps {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  contentLength: number;
  children: React.ReactNode;
  isActive: boolean;
}

const PostContentZoomPcPopup: React.FC<PostContentZoomPcPopupProps> = ({
  currentIndex,
  setCurrentIndex,
  contentLength,
  children,
  isActive,
}) => {
  const resetPostContentZoomPopupInfo = useResetRecoilState(
    postContentZoomPopupInfoAtom,
  );

  // const [postContentZoomPopupInfo, setPostContentZoomPopupInfo] =
  //   useRecoilState(postContentZoomPopupInfoAtom);

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = OVERFLOW_HIDDEN;
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isActive]);

  // useEffect(() => {
  //   alert(currentIndex);
  //   setPostContentZoomPopupInfo((prev) => ({
  //     ...prev,
  //     initIndex: currentIndex,
  //   }));
  // }, [currentIndex]);

  return (
    <PopupOverLayLayoutContainer
      onClick={() => resetPostContentZoomPopupInfo()}
    >
      {contentLength > 1 && (
        <CurrentSlidePositionWrap>
          <CurrentSlidePosition>
            {currentIndex + 1}/{contentLength}
          </CurrentSlidePosition>
        </CurrentSlidePositionWrap>
      )}
      <PostZoomExitButtonWrap>
        <PostContentZoomExitButtonIcon />
      </PostZoomExitButtonWrap>
      {currentIndex > 0 && (
        <LeftSideMoveButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
        >
          <LeftScrollXButtonIcon />
        </LeftSideMoveButton>
      )}
      <PostContentWrap>{children}</PostContentWrap>
      {currentIndex < contentLength - 1 && (
        <RightSideMoveButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
        >
          <RightScrollXButtonIcon />
        </RightSideMoveButton>
      )}
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
  transform: none;
  animation: 0.4s cubic-bezier(0.4, 0, 0, 1.5) 0s 1 normal scale-and-fadein;
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

const ImageSideMoveButton = styled.div`
  position: fixed;
  top: 50%;
  transform: translate(0, -50%);
  padding: 20px;
  cursor: pointer;
  z-index: 100;
`;

const LeftSideMoveButton = styled(ImageSideMoveButton)`
  left: 0px;
`;

const RightSideMoveButton = styled(ImageSideMoveButton)`
  right: 0px;
`;

export default PostContentZoomPcPopup;
