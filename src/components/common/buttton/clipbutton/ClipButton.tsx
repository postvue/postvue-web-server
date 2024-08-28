import anime from 'animejs';
import React, { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { PostClipRsp } from '../../../../global/interface/post';
import { GetMyProfileScrapPreviewsRsp } from '../../../../global/interface/profile';
import { createPostToScrap } from '../../../../services/profile/createPostToScrap';
import { deletePostToScrap } from '../../../../services/profile/deletePostToScrap';
import { getMyProfileScrapPreviews } from '../../../../services/profile/getMyProfileScrapPreview';
import { isActiveScrapViewPopupAtom } from '../../../../states/ProfileAtom';
import { animationStyle } from '../../../../styles/animations';
import theme from '../../../../styles/theme';
import BodyFixScrollElement from '../../../BodyFixScrollElement';

interface ClipButtonProps {
  setClipStete: (postClipRsp: PostClipRsp) => void;
  postId: string;
  isClipped: boolean;
}

interface scrapBoardPositionInterface {
  positionType: string;
  positionValue: number;
  isScrapActive: boolean;
}

const ClipButton: React.FC<ClipButtonProps> = ({
  setClipStete,
  postId,
  isClipped,
}) => {
  const clipRef = useRef<SVGSVGElement>(null);
  const [scrapBoardPreviewList, setScrapBoardPreviewList] = useState<
    GetMyProfileScrapPreviewsRsp[]
  >([]);
  const setSsActiveScrapViewPopup = useSetRecoilState(
    isActiveScrapViewPopupAtom,
  );

  const [scrapBoardPosition, setScrapBoardPosition] =
    useState<scrapBoardPositionInterface>({
      positionType: 'top',
      positionValue: 0,
      isScrapActive: false,
    });

  const onClickClipButton = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    if (clipRef.current) {
      const body = document.body;
      const dom = clipRef.current.getBoundingClientRect();

      const clipY = dom.y;
      const clipHeight = dom.height;
      const bodyHeight = body.offsetHeight;

      if (clipY + clipHeight / 2 > bodyHeight / 2) {
        setScrapBoardPosition((prev) => ({
          ...prev,
          positionType: 'bottom',
          positionValue: clipHeight + 10,
        }));
      } else {
        setScrapBoardPosition((prev) => ({
          ...prev,
          positionType: 'top',
          positionValue: clipHeight + 10,
        }));
      }
    }
    setScrapBoardPosition((prev) => ({ ...prev, isScrapActive: true }));
  };

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

          setScrapBoardPosition((prev) => ({
            ...prev,
            isScrapActive: false,
          }));
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

          setScrapBoardPosition((prev) => ({
            ...prev,
            isScrapActive: false,
          }));
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const onClickMoveScrapView = () => {
    setSsActiveScrapViewPopup(true);
    setScrapBoardPosition((prev) => ({
      ...prev,
      isScrapActive: false,
    }));
  };

  useEffect(() => {
    getMyProfileScrapPreviews(postId).then((value) => {
      setScrapBoardPreviewList(value);
    });
  }, []);

  return (
    <ClipButtonContainer>
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
      {scrapBoardPosition.isScrapActive && (
        <>
          <ScrapBoardContainer
            $positionType={scrapBoardPosition.positionType}
            $positionValue={scrapBoardPosition.positionValue}
          >
            {scrapBoardPreviewList.map((value, index) => {
              return (
                <>
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
                </>
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
            <BodyFixScrollElement />
          </ScrapBoardContainer>
          <ScrapBoardNotClickContainer
            onClick={(e) => {
              e.stopPropagation();
              setScrapBoardPosition((prev) => ({
                ...prev,
                isScrapActive: false,
              }));
            }}
          />
        </>
      )}
    </ClipButtonContainer>
  );
};

const ClipButtonContainer = styled.div`
  position: relative;
`;

const ClipButtonWrap = styled.div`
  cursor: pointer;
`;

const ScrapBoardContainer = styled.div<{
  $positionType: string;
  $positionValue: number;
}>`
  position: absolute;
  width: 198px;
  right: 0px;
  z-index: 1000;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.2);
  ${(props) => props.$positionType}: ${(props) => props.$positionValue}px;
  right: 0px;
  animation: ${animationStyle.fadeIn} 0.1s ease-in forwards;
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

const ScrapBoardNotClickContainer = styled.div`
  height: 100%;
  z-index: 500;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0px auto;
  cursor: auto;
`;

export default ClipButton;
