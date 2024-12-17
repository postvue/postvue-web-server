import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil';

import styled from 'styled-components';
import 'swiper/css';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FollowButton from '../../../components/common/buttton/FollowButton';
import PostReactionSingleElement from '../../../components/common/posts/body/PostReactionSingleElement';
import PostTextContent from '../../../components/common/posts/body/PostTextContent';
import PrevButtonHeaderHeader from '../../../components/layouts/PrevButtonHeaderHeader';
import BlockUserPopup from '../../../components/popups/BlockUserPopup';
import PostReactionPopup from '../../../components/popups/postreactionpopup/PostReactionPopup';
import ScrapViewPopup from '../../../components/popups/profilescrap/ScrapViewPopup';
import ToastMsgPopup from '../../../components/popups/ToastMsgPopup';
import { PROFILE_LIST_PATH } from '../../../const/PathConst';
import {
  POST_IMAGE_TYPE,
  POST_VIDEO_TYPE,
} from '../../../const/PostContentTypeConst';
import { removePostByHiddenPostIdList } from '../../../global/util/HiddenPostIdListUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import {
  activePostCommentComplaintPopupAtom,
  isActivePostComplaintCompletePopupAtom,
  isActivePostComplaintPopupAtom,
  isActivePostDeletePopupAtom,
  isSettingPopupAtom,
  postBlockedUserInfoAtom,
  postContentZoomPopupInfoAtom,
  postRspAtom,
} from '../../../states/PostAtom';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../../../states/PostReactionAtom';
import {
  isActiveProfileBlockPopupAtom,
  isActiveScrapViewPopupAtom,
} from '../../../states/ProfileAtom';
import { isLoadingPopupAtom } from '../../../states/SystemConfigAtom';
import theme from '../../../styles/theme';

import PostCotentZoomPopup from 'components/popups/postzoom/PostContentZoomPopup';
import ProfilePostSettingPopup from 'components/popups/ProfilePostSettingPopup';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { getMyAccountSettingInfo } from 'global/util/MyAccountSettingUtil';
import PostRelationListInfiniteScroll from 'hook/PostRelationInfiniteScroll';
import { postPostInterested } from 'services/post/postPostInterested';
import 'swiper/css/pagination';

import { ReactComponent as PostPreButtonIcon } from 'assets/images/icon/svg/profilepost/PostPreButtonIcon.svg';
import { ReactComponent as ProfilePostSettingButtonIcon } from 'assets/images/icon/svg/profilepost/ProfilePostSettingButtonIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import PostCommentThreadPopup from 'components/popups/postcommentthreadpopup/PostCommentThreadPopup';
import PostComplaintCompletePopup from 'components/popups/profilepost/PostComplaintCompletePopup';
import PostComplaintPopup from 'components/popups/profilepost/PostComplaintPopup';

import LoadingComponent from 'components/common/container/LoadingComponent';
import PostVideoContentELement from 'components/common/posts/element/PostVideoContentElement';
import SnsPostMasonryLayout_ from 'components/layouts/SnsPostMasonryLayout_';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import PostCommentComplaintPopup from 'components/popups/profilepost/PostCommentComplaintPopup';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { PostCommentReplyMsgInfo, PostRsp } from 'global/interface/post';
import { getRandomImage } from 'global/util/shareUtil';
import ProfileAccountPostListInfiniteScroll from 'hook/ProfileAccountPostListInfiniteScroll';
import { QueryStatePostRelationListInfinite } from 'hook/queryhook/QueryStatePostRelationListInfinite';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { deletePost } from 'services/post/deletePost';
import { activeCommentByPostCommentThreadAtom } from 'states/PostThreadAtom';
import { borderShadowStyle_prop } from 'styles/commonStyles';
import SwiperCore from 'swiper';

interface ProfilePostDetailBodyProps {
  postId: string;
  snsPost: PostRsp;
  setSnsPost: SetterOrUpdater<PostRsp>;
  isIntereset: boolean;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  replyMsg: PostCommentReplyMsgInfo | null;
  setReplyMsg: React.Dispatch<
    React.SetStateAction<PostCommentReplyMsgInfo | null>
  >;
  windowWidthSize: number;
  likeIconRef: React.MutableRefObject<{
    [key: string]: SVGSVGElement | null;
  }>;
  likeCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  commentReplyCountRef: React.MutableRefObject<{
    [key: string]: HTMLDivElement | null;
  }>;
  postCommentTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  isFixedPopup: boolean;
  isClosed?: boolean;
  setIsExternalCloseFunc?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfilePostDetailBody: React.FC<ProfilePostDetailBodyProps> = ({
  postId,
  snsPost,
  setSnsPost,
  isIntereset,
  setIsInterest,
  replyMsg,
  setReplyMsg,
  windowWidthSize,
  likeIconRef,
  likeCountRef,
  commentReplyCountRef,
  postCommentTextareaRef,
  isFixedPopup,
  isClosed,
  setIsExternalCloseFunc,
}) => {
  const postSettingButtonRef = useRef<HTMLDivElement>(null);

  const [isSettingActive, setIsSettingActive] =
    useRecoilState(isSettingPopupAtom);
  const reactionPostId = useRecoilValue(reactionPostIdAtom);

  const [isPostReactionPopup, setIsPostReactionPopup] =
    useRecoilState(isPostReactionAtom);
  const [isActiveScrapView, setIsActiveScrapView] = useRecoilState(
    isActiveScrapViewPopupAtom,
  );
  const [isActiveProfileBlock, setIsActiveProfileBlock] = useRecoilState(
    isActiveProfileBlockPopupAtom,
  );
  const isLoadingPopup = useRecoilValue(isLoadingPopupAtom);

  const [isActivePostComplaintPopup, setIsActivePostComplaintPopup] =
    useRecoilState(isActivePostComplaintPopupAtom);
  const [
    isActivePostComplaintCompletePopup,
    setIsActivePostComplaintCompletePopup,
  ] = useRecoilState(isActivePostComplaintCompletePopupAtom);
  const activePostCommentComplaintPopup = useRecoilValue(
    activePostCommentComplaintPopupAtom,
  );

  const [postContentZoomPopupInfo, setPostContentZoomPopupInfo] =
    useRecoilState(postContentZoomPopupInfoAtom);

  const [isActiveRelation, setIsActiveRelation] = useState<boolean>(false);

  const { data: profilePostList, isFetched: isFetchEedProfilePost } =
    QueryStateProfileAccountPostList(snsPost.username, isActiveRelation);

  const [isActivePostDeletePopup, setIsActivePostDeletePopup] = useRecoilState(
    isActivePostDeletePopupAtom,
  );

  const myAccountSettingInfo = getMyAccountSettingInfo();

  const resetSnsPost = useResetRecoilState(postRspAtom);

  const navigate = useNavigate();

  const postBlockedUserInfo = useRecoilValue(postBlockedUserInfoAtom);

  const [swiper, setSwiper] = useState<SwiperCore>();

  useEffect(() => {
    return () => {
      resetSnsPost();
      setIsPostReactionPopup(false);
      setIsActiveScrapView(false);
      setIsActiveProfileBlock(false);
      setIsActivePostComplaintPopup(false);
      setIsActivePostComplaintCompletePopup(false);
    };
  }, []);

  const onClickSettingButton = () => {
    console.log('ㅋㅋㅋㅋ');
    setIsSettingActive(true);
  };

  const onClickPostInterest = () => {
    if (postId && isValidString(postId)) {
      postPostInterested(postId).then((value) => {
        setIsInterest(value.isInterested);
        removePostByHiddenPostIdList(postId);
      });
    }
  };

  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const firstPostContent = snsPost?.postContents[0];

  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: postRelationList,
    isFetched: isFetchedByPostRelationList,
    isLoading: isLoadingByPostRelationList,
  } = QueryStatePostRelationListInfinite(postId || '');

  useEffect(() => {
    if (!isFetchedByPostRelationList || !postRelationList) return;
    if (
      postRelationList.pages.flatMap((value) => value.snsPostRspList).length <=
      0
    ) {
      setIsActiveRelation(true);
    } else {
      setIsActiveRelation(false);
    }
  }, [isFetchedByPostRelationList]);

  // 포스트 게시물 영역 보이는 지
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const [isPopupRendered, setIsPopupRendered] = useState<boolean>(false);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // 요소가 50% 이상 가시할 때 isVisible을 true로 설정
        if (entry.intersectionRatio >= 0.6) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.6, // 요소가 50% 이상 가시하면 트리거
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isValidString(postId)) {
      setTimeout(() => {
        setIsPopupRendered(true);
      }, 400);
    } else {
      setIsPopupRendered(false);
    }

    return () => {
      setIsPopupRendered(false);
    };
  }, [postId]);

  useEffect(() => {
    if (!isClosed) return;

    swiper?.slideTo(0, 0);
  }, [isClosed]);

  return (
    <>
      <ProfilePostContainer>
        <div ref={elementRef}>
          {isIntereset ? (
            <ProfilePostWrap>
              <PostPreButtonWrap>
                <PostPreButton
                  onClick={() => {
                    if (setIsExternalCloseFunc) {
                      setIsExternalCloseFunc(true);
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  <StylePostPreButtonIcon />
                </PostPreButton>
              </PostPreButtonWrap>
              <SettingButtonWrap>
                <SettingButton
                  onClick={onClickSettingButton}
                  ref={postSettingButtonRef}
                >
                  <StyleProfilePostSettingButtonIcon />
                  {windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM &&
                    postId &&
                    postSettingButtonRef.current &&
                    isSettingActive && (
                      <ContextMenuPopup
                        setIsActive={setIsSettingActive}
                        contextMenuRef={postSettingButtonRef.current}
                      >
                        <ProfilePostSettingBody
                          postId={postId}
                          setIsSettingActive={setIsSettingActive}
                          myAccountSettingInfo={myAccountSettingInfo}
                          isBlocked={isBlocked}
                          userId={snsPost.userId}
                          username={snsPost.username}
                          setIsInterest={setIsInterest}
                          ProfilePostSettingBodyStyle={{
                            padding: '20px 0px',
                          }}
                        />
                      </ContextMenuPopup>
                    )}
                </SettingButton>
              </SettingButtonWrap>
              <PostImageWrap>
                <StyledSwiper
                  onSwiper={setSwiper}
                  spaceBetween={20}
                  // slidesPerView={1}
                  pagination={true}
                  loop={snsPost.postContents.length > 1}
                  modules={[
                    Pagination,
                    Navigation,
                    FreeMode,
                    Navigation,
                    Thumbs,
                  ]}
                >
                  {snsPost?.postContents.length > 1 &&
                    snsPost?.postContents.map((value, index) => {
                      return (
                        <SwiperSlide
                          key={index}
                          onClick={() => {
                            setPostContentZoomPopupInfo((prev) => ({
                              ...prev,
                              isActive: true,
                              initIndex: index,
                            }));
                          }}
                        >
                          {value.postContentType === POST_IMAGE_TYPE && (
                            <PostImgWrap>
                              <PostImgDiv src={value.content} />
                            </PostImgWrap>
                          )}
                          {/* @REFER: 주석 제거 */}
                          {value.postContentType === POST_VIDEO_TYPE && (
                            <PostImgWrap>
                              <PostVideoContentELement
                                videoSrc={value.content}
                                posterImg={value.previewImg}
                                isUploaded={value.isUploaded}
                                PostVideoContentELementStyle={{
                                  maxHeight: `${PostMinHeight}px`,
                                  backgroundColor: 'black',
                                }}
                              />
                            </PostImgWrap>
                          )}
                        </SwiperSlide>
                      );
                    })}
                  {snsPost?.postContents.length == 1 && (
                    <PostContentFrame
                    // onClick={() => {
                    //   setPostContentZoomPopupInfoAtom((prev) => ({
                    //     ...prev,
                    //     isActive: true,
                    //     initIndex: 0,
                    //   }));
                    // }}
                    >
                      {snsPost?.postContents[0].postContentType ===
                        POST_IMAGE_TYPE && (
                        <PostImgBySingle
                          src={snsPost?.postContents[0].content}
                        />
                      )}

                      {/* @REFER: 주석 제거 */}
                      {snsPost?.postContents[0].postContentType ===
                        POST_VIDEO_TYPE && (
                        <PostVideoContentELement
                          videoSrc={snsPost?.postContents[0].content}
                          posterImg={snsPost?.postContents[0].previewImg}
                          isUploaded={snsPost?.postContents[0].isUploaded}
                          stateValue={postId}
                          isVisibilityDetection={true}
                          visibilityThreshold={0.5}
                          PostVideoContentELementStyle={
                            windowWidthSize < MEDIA_MOBILE_MAX_WIDTH_NUM
                              ? {
                                  borderRadius: `${PostContentRadis} ${PostContentRadis} 0 0`,
                                }
                              : {}
                          }
                          PostVideoStyle={
                            windowWidthSize < MEDIA_MOBILE_MAX_WIDTH_NUM
                              ? {
                                  borderRadius: `${PostContentRadis} ${PostContentRadis} 0 0`,
                                }
                              : {}
                          }
                          onVideoError={() => {
                            alert(
                              '현재 브라우저에서 해당 게시물이 호환되지 않습니다.',
                            );
                          }}
                        />
                      )}
                    </PostContentFrame>
                  )}
                </StyledSwiper>
              </PostImageWrap>
              {isPopupRendered && (
                <PostContentContainer>
                  <ProfileWrap>
                    <ProfileLinkDiv
                      onClick={() => {
                        navigate(`${PROFILE_LIST_PATH}/${snsPost?.username}`);
                      }}
                    >
                      <ProfileImg src={snsPost?.profilePath} />
                      <ProfileUserNameFollowWrap>
                        <ProfileFollowButtonWrap>
                          <ProfileUserName>{snsPost?.username}</ProfileUserName>
                          {snsPost?.followable ? (
                            <FollowButton
                              userId={snsPost.userId}
                              fontSize={theme.fontSizes.Subhead2}
                              style={FollowStyle}
                              isFollow={snsPost.isFollowed}
                            />
                          ) : (
                            <></>
                          )}
                        </ProfileFollowButtonWrap>
                        <ProfilePosition>
                          {snsPost.location.address}
                        </ProfilePosition>
                        {/**@REFER: 수정 */}
                      </ProfileUserNameFollowWrap>
                    </ProfileLinkDiv>
                  </ProfileWrap>

                  {postId && (
                    <PostReactionSingleElement
                      username={snsPost.username}
                      postId={snsPost.postId}
                      mainImageUrl={getRandomImage(
                        snsPost.postContents
                          .filter((v) => v.postContentType === POST_IMAGE_TYPE)
                          .map((v) => v.content),
                        snsPost.profilePath,
                      )}
                    />
                  )}

                  <PostTextContent
                    postTitle={snsPost.postTitle}
                    postBodyText={snsPost.postBodyText}
                    postedAt={snsPost.postedAt}
                    tags={snsPost.tags}
                    isExpandedBodyText={true}
                  />

                  {/* <div>{snsPost?.location.latitude}</div>
  <div>{snsPost?.location.longitude}</div> */}
                </PostContentContainer>
              )}
            </ProfilePostWrap>
          ) : (
            <>
              <PrevButtonHeaderHeader
                titleName=""
                HeaderLayoutStyle={PreButtonHeaderStyle}
              />
              <NotInerestedMessageWrap>
                <NotInerestedMessage>
                  <div>이 게시물을 숨겼습니다.</div>
                  <NotInerestedCancelButtonWrap>
                    <NotInerestedCancelButton onClick={onClickPostInterest}>
                      취소
                    </NotInerestedCancelButton>
                  </NotInerestedCancelButtonWrap>
                </NotInerestedMessage>
              </NotInerestedMessageWrap>
            </>
          )}
        </div>
        <BoundaryBarStick />
        <RelatedPostContainer>
          {isPopupRendered ? (
            <>
              <RelatedTitle>연관 게시글</RelatedTitle>
              {postId && (
                <>
                  {postRelationList &&
                    isFetchedByPostRelationList &&
                    postRelationList?.pages.flatMap(
                      (value) => value.snsPostRspList,
                    ).length > 0 &&
                    !isLoadingByPostRelationList && (
                      <PostRelationWrap>
                        <SnsPostMasonryLayout_
                          snsPostList={postRelationList.pages.flatMap(
                            (page) => page.snsPostRspList,
                          )}
                          isAutoPlay={!isVisible}
                        />

                        <PostRelationListInfiniteScroll postId={postId} />
                      </PostRelationWrap>
                    )}
                </>
              )}
              {isFetchedByPostRelationList &&
                postRelationList &&
                profilePostList &&
                postRelationList?.pages.flatMap((value) => value.snsPostRspList)
                  .length <= 0 && (
                  <PostRelationWrap>
                    <SnsPostMasonryLayout_
                      snsPostList={profilePostList?.pages
                        .flatMap((value) => value.snsPostRspList)
                        .filter((value) => value.postId !== postId)}
                      isAutoPlay={!isVisible}
                    />
                    <ProfileAccountPostListInfiniteScroll
                      username={snsPost.username}
                    />
                  </PostRelationWrap>
                )}
            </>
          ) : (
            <div>
              <div style={{ position: 'relative' }}>
                <LoadingComponent
                  LoadingComponentStyle={{
                    display: 'flex',
                    position: 'static',
                    left: 0,
                    transform: 'none',
                    top: 0,
                    padding: '50px 0 50px 0',
                  }}
                  LoadingImgStyle={{ margin: '0 auto' }}
                />
              </div>
            </div>
          )}
        </RelatedPostContainer>

        {postId !== undefined && firstPostContent && isActiveScrapView && (
          <ScrapViewPopup
            isFixed={isFixedPopup}
            postId={postId}
            postContentUrl={firstPostContent.content}
            postContentType={firstPostContent.postContentType}
            snsPost={snsPost}
            setSnsPost={setSnsPost}
            isActiveScrapViewPopup={isActiveScrapView}
            setIsActiveScrapViewPopup={setIsActiveScrapView}
          />
        )}

        {isActiveProfileBlock && (
          <BlockUserPopup
            isFixed={isFixedPopup}
            userInfo={postBlockedUserInfo}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            setIsSettingPopup={setIsSettingActive}
          />
        )}

        {isActivePostComplaintPopup && (
          <PostComplaintPopup isFixed={isFixedPopup} />
        )}
        {activePostCommentComplaintPopup.isActive && (
          <PostCommentComplaintPopup isFixed={isFixedPopup} />
        )}
        {isActivePostComplaintCompletePopup && (
          <PostComplaintCompletePopup
            userInfo={{ userId: snsPost.userId, username: snsPost.username }}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            isFixed={isFixedPopup}
          />
        )}
        {isActivePostDeletePopup && (
          <ConfirmPopup
            setIsPopup={setIsActivePostDeletePopup}
            confirmPopupTitle={'포스트를 삭제하시나요? '}
            confirmPopupSubTitle={
              '삭제시 포스트를 복구 할 수 없습니다. \n 그래도 정말 삭제하시나요?'
            }
            actionFunc={() => {
              if (!postId) return;
              deletePost(postId)
                .then(() => {
                  setIsActivePostDeletePopup(false);
                })
                .catch(() => {
                  setIsActivePostDeletePopup(false);
                  alert('오류로 인해 포스트 삭제에 실패 했습니다.');
                });
            }}
          />
        )}
        {isLoadingPopup && <LoadingPopup />}

        <ToastMsgPopup />
      </ProfilePostContainer>
      {/* 포스터 설정 팝업 */}
      {windowWidthSize <= MEDIA_MOBILE_MAX_WIDTH_NUM &&
        postId &&
        isSettingActive && (
          <ProfilePostSettingPopup
            postId={postId}
            myAccountSettingInfo={myAccountSettingInfo}
            isBlocked={isBlocked}
            userId={snsPost.userId}
            username={snsPost.username}
            setIsInterest={setIsInterest}
            isFixed={isFixedPopup}
          />
        )}
      {postContentZoomPopupInfo.isActive && (
        <PostCotentZoomPopup
          isFixed={isFixedPopup}
          snsPost={snsPost}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
      {/* 포스트 반응 팝업: 댓글, 리포스트, 하트 */}
      {windowWidthSize <= MEDIA_MOBILE_MAX_WIDTH_NUM && isPostReactionPopup && (
        <PostReactionPopup
          postId={reactionPostId}
          username={snsPost.username}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
          isFixed={isFixedPopup}
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
  );
};

const ImageBorderRadius = '20px';
const PostContentRadis = '30px';

const ProfilePostContainer = styled.div``;

const ProfilePostWrap = styled.div`
  position: relative;

  // margin: 0 auto;
  // @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
  //   margin: 0 10px 0 10px;
  // }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) =>
      theme.systemSize.appDisplaySize.profilePostMaxWidth};
    box-shadow: ${borderShadowStyle_prop};
    border-radius: ${ImageBorderRadius};
    margin: 10px auto 15px auto;
    padding: 0 10px 10px 10px;
  }
`;

const PostContentFrame = styled.div`
  width: 100%;
`;

const PostImgBySingle = styled.img`
  width: 100%;
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${PostContentRadis} ${PostContentRadis} 0px 0px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${ImageBorderRadius};
  }
`;

const PostMinHeight = 500;
const PostImgWrap = styled(PostContentFrame)`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-height: ${PostMinHeight}px;
    aspect-ratio: 1 / 1.5;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    aspect-ratio: 1 / 1.2;
  }
`;

const PostImgDiv = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: ${PostContentRadis} ${PostContentRadis} 0px 0px;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${PostContentRadis} ${PostContentRadis} 0px 0px;
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: ${ImageBorderRadius};
  }
`;

const PostImageWrap = styled.div`
  position: relative;
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-top: 8px;
  }
`;

const PostContentContainer = styled.div`
  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding: 15px
      ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 0
      ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  }

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding: 15px 5px 0 5px;
  }
`;

const ProfileWrap = styled.div`
  display: flex;
`;

const ProfileLinkDiv = styled.div`
  display: flex;
  cursor: pointer;
`;

const ProfileFollowButtonWrap = styled.div`
  display: flex;
  gap: 6px;
`;

const ProfileImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: ${PostContentRadis};
  object-fit: cover;
`;

const ProfileUserNameFollowWrap = styled.div`
  padding: 0 6px 0 8px;
`;

const ProfileUserName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const FollowStyle: React.CSSProperties = {
  margin: '0',
};

const ProfilePosition = styled.div`
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const BoundaryBarStick = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: 1px;
`;

const RelatedPostContainer = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const RelatedTitle = styled.div`
  padding: 14px 0 0 22px;
`;

const SettingButtonWrap = styled.div`
  position: absolute;
  z-index: 1010;
  cursor: pointer;
  right: 0px;
`;

const SettingButton = styled.div`
  position: relative;
  padding: 15px;
`;

const NotInerestedMessageWrap = styled.div`
  display: flex;
  flex-flow: column;
  background-color: ${({ theme }) => theme.grey.Grey1};
  padding: 19px 23px;
  border-radius: 8px;
  margin: 0px 10px 10px 10px;
`;
const NotInerestedMessage = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey6};
`;
const NotInerestedCancelButtonWrap = styled.div`
  display: flex;
  justify-content: end;
`;
const NotInerestedCancelButton = styled.div`
  cursor: pointer;
`;

const PreButtonHeaderStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
};

const StyledSwiper = styled(Swiper)`
  .swiper-pagination-bullet {
    background-color: ${({ theme }) => theme.mainColor.White};
    opacity: 0.3;
  }

  .swiper-pagination-bullet-active {
    background-color: ${({ theme }) => theme.mainColor.White};
    opacity: 1;
  }
`;

const PostPreButtonWrap = styled.div`
  position: absolute;
  z-index: 1010;
`;

const PostPreButton = styled.div`
  position: fixed;
  cursor: pointer;
  padding: 15px;
`;

const PostRelationWrap = styled.div`
  padding: 15px 11px 0 11px;
`;

const StylePostPreButtonIcon = styled(PostPreButtonIcon)`
  vertical-align: bottom;
`;

const StyleProfilePostSettingButtonIcon = styled(ProfilePostSettingButtonIcon)`
  vertical-align: bottom;
`;

export default ProfilePostDetailBody;
