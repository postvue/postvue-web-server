import React, { useEffect, useMemo } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import styled from 'styled-components';
import { Swiper } from 'swiper/react';
import { POST_IMAGE_TYPE } from '../../../const/PostContentTypeConst';
import { activeScrapViewPopupInfoAtom } from '../../../states/ProfileAtom';

import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import ProfileAccountPostListInfiniteScroll from 'hook/ProfileAccountPostListInfiniteScroll';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';

import { ReactComponent as EmptyPostIcon } from 'assets/images/icon/svg/empty/EmptyPostIcon.svg';
import { PROFILE_POST_LIST_PATH } from 'const/PathConst';
import { stackRouterPush } from 'global/util/reactnative/nativeRouter';
import ProfileAccountInfo from '../profileaccountbody/ProfileAccountInfo';

interface ProfileAccountBodyProps {
  username: string;
  ProfileAccountBodyContainerStyle?: React.CSSProperties;
}

const ProfileAccountBodyLayout: React.FC<ProfileAccountBodyProps> = ({
  username,
  ProfileAccountBodyContainerStyle,
}) => {
  const navigate = useNavigate();
  // const reactionPostId = useRecoilValue(reactionPostIdAtom);
  // const activeProfileAccountPopupInfo = useRecoilValue(
  //   activeProfileAccountPopupInfoAtom,
  // );

  const { data: profileInfo, isFetched: isFetchedByProfileInfo } =
    QueryStateProfileInfo(username);

  const { data: snsProfilePostList } = QueryStateProfileAccountPostList(
    username || '',
    !!profileInfo &&
      profileInfo.isBlocked &&
      !profileInfo.isPrivate &&
      !profileInfo.isBlockerUser,
  );

  const resetActiveScrapViewPopupInfo = useResetRecoilState(
    activeScrapViewPopupInfoAtom,
  );

  // const isPostDetailInfoPopup = useRecoilValue(isPostDetailInfoPopupAtom);

  // Ref 관련 변수
  // const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  // const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  // const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
  //   {},
  // );
  // const postCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 상태 관리 관련 변수
  // const [replyMsg, setReplyMsg] = useState<PostCommentReplyMsgInfo | null>(
  //   null,
  // );
  // const activeCommentByPostCommentThread = useRecoilValue(
  //   activeCommentByPostCommentThreadAtom,
  // );

  // const resetActiveCommentByPostCommentThread = useResetRecoilState(
  //   activeCommentByPostCommentThreadAtom,
  // );

  useEffect(() => {
    return () => {
      // resetIsPostReactionPopup();
      resetActiveScrapViewPopupInfo();
      // resetActiveCommentByPostCommentThread();
      // setReplyMsg(null);
    };
  }, []);

  // const [snsPost, setSnsPost] = useRecoilState(postRspAtom);

  // useEffect(() => {
  //   snsProfilePostList?.pages
  //     .flatMap((value) => value.snsPostRspList)
  //     .forEach((snsPostRsp) => {
  //       if (snsPostRsp.postId === reactionPostId) {
  //         setSnsPost({ ...snsPostRsp });
  //       }
  //     });
  // }, [reactionPostId]);

  const profilePostList = useMemo(
    () => snsProfilePostList?.pages.flatMap((value) => value.snsPostRspList),
    [snsProfilePostList],
  );

  const containerRefs = useMemo(
    () => profilePostList?.map(() => React.createRef<HTMLDivElement>()),
    [profilePostList],
  );

  return (
    <>
      {isFetchedByProfileInfo && (
        <ProfileAccountBodyContainer style={ProfileAccountBodyContainerStyle}>
          <ProfileAccountBodyWrap>
            <ProfileAccountInfo username={username} />
            {profileInfo && profileInfo.isBlocked ? (
              <ProfileBlockMessageTitle>
                @{profileInfo.username} 님이 차단되었습니다.
              </ProfileBlockMessageTitle>
            ) : (
              profileInfo &&
              profileInfo.isPrivate && (
                <ProfileBlockMessageContainer
                  $height={window.innerHeight - 300}
                >
                  <ProfileBlockMessageTitle>
                    비공개 계정입니다.
                  </ProfileBlockMessageTitle>
                </ProfileBlockMessageContainer>
              )
            )}

            {profileInfo &&
              !profileInfo.isBlocked &&
              !profileInfo.isPrivate &&
              !profileInfo.isBlockerUser && (
                <ProfilePostListContainer>
                  {containerRefs &&
                    profilePostList?.map((v, k) => {
                      return (
                        <ProfilePostContent key={k}>
                          <ProfilePostContainer
                            onClick={() => {
                              // if (
                              //   window.innerWidth > MEDIA_MOBILE_MAX_WIDTH_NUM
                              // ) {
                              //   navigate(
                              //     generatePath(PROFILE_POST_LIST_PATH, {
                              //       user_id: v.username,
                              //       post_id: v.postId,
                              //     }),
                              //     {
                              //       state: { isDetailPopup: true },
                              //     },
                              //   );
                              // } else {
                              //   // 모바일 크기
                              //   // url만 바뀌도록 변경

                              //   // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
                              //   // const searchParams = new URLSearchParams(
                              //   //   location.search,
                              //   // );
                              //   const searchParams = new URLSearchParams(
                              //     location.search,
                              //   );

                              //   searchParams.set(
                              //     POST_DETAIL_POPUP_PARAM,
                              //     TRUE_PARAM,
                              //   );
                              //   searchParams.set(
                              //     POST_DETAIL_POST_ID_PARAM,
                              //     v.postId,
                              //   );
                              //   searchParams.set(
                              //     POST_DETAIL_PROFILE_PARAM,
                              //     v.username,
                              //   );
                              //   searchParams.set(
                              //     PROFILE_POPUP_DISPLAY_PARAM,
                              //     FALSE_PARAM,
                              //   );

                              //   // 새로운 쿼리 파라미터가 포함된 URL 생성
                              //   const newSearch = searchParams.toString();
                              //   const newPath = `${location.pathname}?${newSearch}`;

                              //   navigate(newPath, {
                              //     state: { isDetailPopup: true },
                              //   });
                              // }

                              // const data: RoutePushEventDateInterface = {
                              //   isShowInitBottomNavBar: true,
                              // };
                              stackRouterPush(
                                navigate,
                                generatePath(PROFILE_POST_LIST_PATH, {
                                  user_id: v.username,
                                  post_id: v.postId,
                                }),
                                // data,
                              );
                            }}
                          >
                            <ImageWrapper>
                              {v.postContents[0].postContentType ===
                              POST_IMAGE_TYPE ? (
                                <StyledImage src={v.postContents[0].content} />
                              ) : (
                                <StyledImage
                                  src={v.postContents[0].previewImg}
                                />
                              )}
                            </ImageWrapper>
                            {/* <>
                                {v.postContents.length > 1 ? (
                                  <ScrollXMoveButtonContainer
                                    scrollContainerRef={containerRefs[k]}
                                    leftMoveNum={200}
                                    LeftScrollXButtonStyle={{ left: '-20px' }}
                                    RightScrollXButtonStyle={{ right: '-20px' }}
                                    ScrollLeftIcon={<LeftScrollXButtonIcon />}
                                    ScrollRightIcon={<RightScrollXButtonIcon />}
                                  >
                                    <ProfileScrapImgListWrap
                                      ref={containerRefs[k]}
                                    >
                                      {v.postContents.map((value, i) => (
                                        <ProfileAccountContentMemo
                                          key={k * 10 + i}
                                        >
                                          {value.postContentType ===
                                            POST_IMAGE_TYPE && (
                                            <ProfileScrapImg
                                              src={value.content}
                                              style={{ aspectRatio: '3/4' }}
                                            />
                                          )}
                                          {value.postContentType ===
                                            POST_VIDEO_TYPE && (
                                            <PostVideoContentELement
                                              PostVideoStyle={{
                                                aspectRatio: '3/4',
                                                objectFit: 'cover',
                                              }}
                                              posterImg={value.previewImg}
                                              videoSrc={value.content}
                                              isUploaded={value.isUploaded}
                                              isVisibilityDetection={true}
                                              isClickPlayToTab={false}
                                            />
                                          )}
                                        </ProfileAccountContentMemo>
                                      ))}
                                    </ProfileScrapImgListWrap>
                                  </ScrollXMoveButtonContainer>
                                ) : (
                                  <>
                                    {v.postContents[0].postContentType ===
                                      POST_IMAGE_TYPE && (
                                      <ProfileScrapImg
                                        src={v.postContents[0].content}
                                      />
                                    )}
                                    {v.postContents[0].postContentType ===
                                      POST_VIDEO_TYPE && (
                                      <PostVideoContentELement
                                        PostVideoContentELementStyle={{
                                          width: '100%',
                                        }}
                                        PostVideoStyle={{
                                          objectFit: 'cover',
                                          aspectRatio: '3 / 4',
                                        }}
                                        posterImg={v.postContents[0].previewImg}
                                        videoSrc={v.postContents[0].content}
                                        isUploaded={
                                          v.postContents[0].isUploaded
                                        }
                                        isVisibilityDetection={true}
                                        isClickPlayToTab={false}
                                      />
                                    )}
                                  </>
                                )}
                              </> */}

                            {/* <PostReactionListElement
                                username={v.username}
                                postId={v.postId}
                                snsPost={v}
                                mainImageUrl={getRandomImage(
                                  v.postContents
                                    .filter(
                                      (v) =>
                                        v.postContentType === POST_IMAGE_TYPE,
                                    )
                                    .map((v) => v.content),
                                  v.profilePath,
                                )}
                              />
                              <PostTextContent
                                postTitle={v.postTitle}
                                postBodyText={v.postBodyText}
                                postedAt={v.postedAt}
                                tags={v.tags}
                              /> */}
                          </ProfilePostContainer>
                          {/* <BoundaryStickBar /> */}
                        </ProfilePostContent>
                      );
                    })}

                  {profilePostList && profilePostList.length <= 0 && (
                    <ProfileNotPostWrap>
                      <ProfileNotPostImg>
                        <EmptyPostIcon />
                      </ProfileNotPostImg>
                      <ProfileNotPostTitle>
                        등록한 게시물 없음
                      </ProfileNotPostTitle>
                    </ProfileNotPostWrap>
                  )}
                </ProfilePostListContainer>
              )}
            {username && (
              <ProfileAccountPostListInfiniteScroll username={username} />
            )}
          </ProfileAccountBodyWrap>
        </ProfileAccountBodyContainer>
      )}

      {/* 팝업  */}
      {/* {!isPostDetailInfoPopup && (
        <>
          {isPopupActive && (
            <PostReactionPopup
              postId={reactionPostId}
              username={snsPost.username}
              replyMsg={replyMsg}
              setReplyMsg={setReplyMsg}
            />
          )}

          {activeCommentByPostCommentThread.isActive && (
            <PostCommentThreadPopup
              snsPost={snsPost}
              postCommentTextareaRef={postCommentTextareaRef}
              replyMsg={replyMsg}
              setReplyMsg={setReplyMsg}
              likeIconByCommentRef={likeIconRef}
              likeCountByCommentRef={likeCountRef}
              commentCountByCommentRef={commentReplyCountRef}
            />
          )}
        </>
      )} */}
    </>
  );
};

const ProfileAccountBodyContainer = styled.div``;

const ProfileAccountBodyWrap = styled.div`
  min-height: calc(
    100dvh -
      ${(parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--safe-area-inset-bottom',
        ),
      ) || 0) +
      (parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--safe-area-inset-top',
        ),
      ) || 0)}px
  );
  margin-bottom: env(safe-area-inset-bottom);
`;

const ProfileBlockMessageContainer = styled.div<{ $height: number }>`
  height: 100%;
  min-height: ${(props) => props.$height}px;
`;

const ProfileBlockMessageTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead2};
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  white-space: nowrap;
  color: ${({ theme }) => theme.grey.Grey6};
`;

const ProfilePostListContainer = styled.div`
  padding-top: 26px;
  display: flex;
  flex-flow: column;
  gap: 20px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  padding: 0 2px;
`;

const ProfilePostContent = styled.div``;

const ProfilePostContainer = styled.div`
  cursor: pointer;
  // margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
  //   0px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfilePostImgWrap = styled.div`
  width: 100%;
  flex: 0 0 auto;
  cursor: pointer;
`;

const ProfilePostImg = styled.div<{ src: string }>`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/3.5;
  background: url(${(props) => props.src}) center center / cover;
  background-color: hsl(0, 0%, 97%);

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 20px;
  }

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 8px;
  }
`;

const StyledSwiper = styled(Swiper)`
  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.mainColor.White};
    opacity: 0.3;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.mainColor.White};
    opacity: 1;
  }

  .slider .swiper-slide {
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
  }
`;

const ProfileScrapImgListWrap = styled.div`
  display: flex;
  gap: 3px;
  overflow-x: auto;
  white-space: nowrap;

  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProfileScrapImgWrap = styled.div`
  width: 60%;
  flex: 0 0 auto;

  cursor: pointer;
`;

// const ProfileScrapImg = styled.div<{ src: string }>`
//   width: 100%;
//   vertical-align: bottom;
//   aspect-ratio: 3/3.5;
//   background: url(${(props) => props.src}) center center / cover;
//   border-radius: 8px;
//   background-color: hsl(0, 0%, 97%);
// `;

const ProfileScrapImg = styled.img`
  width: 100%;
  vertical-align: bottom;
  aspect-ratio: 3/3.5;
  object-fit: cover;

  border-radius: 8px;
  background-color: hsl(0, 0%, 97%);
`;

const ProfileNotPostWrap = styled.div`
  position: absolute;
  top: calc(50% - 50px);
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column;
`;

const ProfileNotPostImg = styled.div`
  margin: 0 auto;
`;

const ProfileNotPostTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body5};
  white-space: nowrap;
`;

export default ProfileAccountBodyLayout;
