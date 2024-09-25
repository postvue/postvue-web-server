import anime from 'animejs';
import { QueryStatePostScrapPreviewList } from 'hook/queryhook/QueryStatePostScrapPreviewList';
import React, { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { reactionPostIdAtom } from 'states/PostReactionAtom';
import styled from 'styled-components';
import { PostClipRsp } from '../../../../global/interface/post';
import { GetMyProfileScrapPreviewsRsp } from '../../../../global/interface/profile';
import { createPostToScrap } from '../../../../services/profile/createPostToScrap';
import { deletePostToScrap } from '../../../../services/profile/deletePostToScrap';
import { isActiveScrapViewPopupAtom } from '../../../../states/ProfileAtom';
import theme from '../../../../styles/theme';
import ContextMenuPopup from '../../../popups/ContextMenuPopup';
import LongPressToResizeButton from '../LongPressToResizeButton';

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
  const clipRef = useRef<HTMLDivElement>(null);
  const [scrapBoardPreviewList, setScrapBoardPreviewList] = useState<
    GetMyProfileScrapPreviewsRsp[]
  >([]);
  const setSsActiveScrapViewPopup = useSetRecoilState(
    isActiveScrapViewPopupAtom,
  );

  const [isScrapBoardActive, setIsScrapBoardActive] = useState<boolean>(false);

  const { data, isLoading } = QueryStatePostScrapPreviewList(
    postId,
    isScrapBoardActive,
  );

  const setReactionPostId = useSetRecoilState(reactionPostIdAtom);

  const onClickClipButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    setReactionPostId(postId);
    setIsScrapBoardActive(true);
  };

  useEffect(() => {
    if (!data) return;
    setScrapBoardPreviewList(data);
  }, [data]);

  const onAddScrap = (scrapId: string) => {
    if (postId) {
      createPostToScrap(scrapId, postId)
        .then((value) => {
          const postClipRsp: PostClipRsp = {
            isClipped: value.isClipped,
          };
          if (!isClipped) {
            setClipStete(postClipRsp);
          }
          if (value.isClipped) {
            anime({
              targets: clipRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }

          setScrapBoardPreviewList((prev) => {
            const prevCopy = [...prev];

            prev.forEach((prevValue, index) => {
              if (prevValue.scrapBoardId === scrapId) {
                prevCopy[index].isScraped = value.isScraped;
              }
            });
            return prevCopy;
          });

          setIsScrapBoardActive(false);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const onDeleteScrap = (scrapId: string) => {
    if (postId) {
      deletePostToScrap(scrapId, postId)
        .then((value) => {
          if (!value.isClipped) {
            const postClipRsp: PostClipRsp = {
              isClipped: value.isClipped,
            };
            setClipStete(postClipRsp);
          }

          setScrapBoardPreviewList((prev) => {
            const prevCopy = [...prev];

            prev.forEach((prevValue, index) => {
              if (prevValue.scrapBoardId === scrapId) {
                prevCopy[index].isScraped = value.isScraped;
              }
            });
            return prevCopy;
          });

          setIsScrapBoardActive(false);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const onClickMoveScrapView = () => {
    setSsActiveScrapViewPopup(true);
    setIsScrapBoardActive(false);
  };

  return (
    <ClipButtonContainer key={postId}>
      <LongPressToResizeButton resize={0.85} resizeSpeedRate={0.2}>
        <ClipButtonWrap onClick={(e) => onClickClipButton(e)} ref={clipRef}>
          <svg
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
      </LongPressToResizeButton>
      {isScrapBoardActive && !isLoading && (
        <ContextMenuPopup
          contextMenuRef={clipRef}
          setIsActive={setIsScrapBoardActive}
        >
          {scrapBoardPreviewList.map((value, index) => {
            return (
              <React.Fragment key={value.scrapBoardId}>
                {value.isScraped ? (
                  <ScrapBoardItem
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteScrap(value.scrapBoardId);
                    }}
                  >
                    <div>{value.scrapBoardName}</div>
                    <ScrapBoardRemoveButton>제거</ScrapBoardRemoveButton>
                  </ScrapBoardItem>
                ) : (
                  <ScrapBoardItem
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddScrap(value.scrapBoardId);
                    }}
                  >
                    <div>{value.scrapBoardName}</div>
                    <ScrapBoardAddButton>추가</ScrapBoardAddButton>
                  </ScrapBoardItem>
                )}
              </React.Fragment>
            );
          })}
          <ScrapBoardMoveItem
            onClick={(e) => {
              e.stopPropagation();
              onClickMoveScrapView();
            }}
          >
            <div>전체 스크랩 보기</div>
            <div>이동</div>
          </ScrapBoardMoveItem>
        </ContextMenuPopup>
      )}
    </ClipButtonContainer>
  );
};

const ClipButtonContainer = styled.div`
  position: relative;
`;

const ClipButtonWrap = styled.div`
  cursor: pointer;
  display: flex;
`;

const ScrapBoardItem = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body3};
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const ScrapBoardAddButton = styled.div``;

const ScrapBoardRemoveButton = styled(ScrapBoardAddButton)`
  color: ${({ theme }) => theme.errorColor.Red};
`;

const ScrapBoardMoveItem = styled(ScrapBoardItem)`
  color: ${({ theme }) => theme.mainColor.Blue};
`;

export default ClipButton;
