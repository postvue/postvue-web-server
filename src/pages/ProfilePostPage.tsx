import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import PostVideoContentELement from 'components/common/posts/element/PostVideoContentElement';
import { onClickClipGlobalState } from 'global/globalstateaction/onClickClipGlobalState';
import styled from 'styled-components';
import 'swiper/css';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BottomNavBar from '../components/BottomNavBar';
import FollowButton from '../components/common/buttton/FollowButton';
import PostReactionSingleElement from '../components/common/posts/body/PostReactionSingleElement';
import PostTextContent from '../components/common/posts/body/PostTextContent';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import PrevButtonHeaderHeader from '../components/layouts/PrevButtonHeaderHeader';
import BlockUserPopup from '../components/popups/BlockUserPopup';
import PostReactionPopup from '../components/popups/postreactionpopup/PostReactionPopup';
import ScrapViewPopup from '../components/popups/ScrapViewPopup';
import ToastMsgPopup from '../components/popups/ToastMsgPopup';
import { INIT_SCROLL_POSITION } from '../const/AttributeConst';
import { PROFILE_LIST_PATH } from '../const/PathConst';
import {
  POST_IMAGE_TYPE,
  POST_VIDEO_TYPE,
} from '../const/PostContentTypeConst';
import {
  getHiddenPostIdList,
  removePostByHiddenPostIdList,
} from '../global/util/HiddenPostIdListUtil';
import { isValidString } from '../global/util/ValidUtil';
import {
  isActivePostComplaintCompletePopupAtom,
  isActivePostComplaintPopupAtom,
  postBlockedUserInfoAtom,
  postContentZoomPopupInfoAtom,
  postRspAtom,
} from '../states/PostAtom';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../states/PostReactionAtom';
import {
  isActiveProfileBlockPopupAtom,
  isActiveScrapViewPopupAtom,
  myProfileClipHashMapAtom,
  profilePostHashMapAtom,
} from '../states/ProfileAtom';
import {
  isLoadingPopupAtom,
  systemPostRspHashMapAtom,
} from '../states/SystemConfigAtom';
import theme from '../styles/theme';

import PostCotentZoomPopup from 'components/popups/PostContentZoomPopup';
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
import WindowResizeSenceComponent from 'components/common/container/WindowResizeSenseComponent';
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import PostCommentThread from 'components/popups/postcommentthreadpopup/PostCommentThreadPopup';
import PostReactionPopupBody from 'components/popups/postreactionpopup/body/PostReactionPopupBody';
import PostComplaintCompletePopup from 'components/popups/profilepost/PostComplaintCompletePopup';
import PostComplaintPopup from 'components/popups/profilepost/PostComplaintPopup';
import SnsSharePopup from 'components/popups/SnsSharePopup';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import { QueryStatePostRelationListInfinite } from 'hook/queryhook/QueryStatePostRelationListInfinite';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
import { activeCommentByPostCommentThreadAtom } from 'states/PostThreadAtom';
import { borderShadowStyle_prop } from 'styles/commonStyles';
const ProfilePostPage: React.FC = () => {
  // 클립 관련 상태 관리
  const [profilePostHashMap, setProfilePostHashMap] = useRecoilState(
    profilePostHashMapAtom,
  );
  const [myProfileClipHashMap, setMyProfileClipHashMap] = useRecoilState(
    myProfileClipHashMapAtom,
  );
  const postSettingButtonRef = useRef<HTMLDivElement>(null);

  const param = useParams();
  const snsSystemPostHashMap = useRecoilValue(systemPostRspHashMapAtom);
  const postId = param.post_id;
  const user_id = param.user_id;
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const [isSettingActive, setIsSettingActive] = useState<boolean>(false);
  const [reactionPostId, setReactionPostId] =
    useRecoilState(reactionPostIdAtom);

  const hiddenPostIdList = getHiddenPostIdList();
  const [isIntereset, setIsInterest] = useState<boolean>(true);

  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);
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

  const [isSharePopup, setIsSharePopup] = useState<boolean>(false);

  const myAccountSettingInfo = getMyAccountSettingInfo();

  const [postContentZoomPopupInfo, setPostContentZoomPopupInfoAtom] =
    useRecoilState(postContentZoomPopupInfoAtom);

  const resetSnsPost = useResetRecoilState(postRspAtom);

  const navigate = useNavigate();

  const [isQueryProfilePost, setIsQueryProfilePost] = useState<boolean>(false);

  const postBlockedUserInfo = useRecoilValue(postBlockedUserInfoAtom);
  const { data: profilePost, isError: isErrorByProfilePost } =
    QueryStateProfilePost(postId || '', isQueryProfilePost);

  useEffect(() => {
    window.scrollTo({ top: INIT_SCROLL_POSITION });
    if (postId) {
      const selectedPost = snsSystemPostHashMap.get(postId);

      if (selectedPost) {
        setSnsPost(selectedPost);
      } else {
        setIsQueryProfilePost(true);
      }

      if (hiddenPostIdList.includes(postId)) {
        setIsInterest(false);
      }
    }
  }, [postId]);

  useEffect(() => {
    if (!profilePost) return;
    setSnsPost(profilePost);
  }, [profilePost]);

  useEffect(() => {
    if (isErrorByProfilePost) {
      navigate(`${PROFILE_LIST_PATH}/${user_id}`, { replace: true });
    }
  }, [isErrorByProfilePost]);

  useEffect(() => {
    return () => {
      // resetIsPostReactionPopup();
      resetSnsPost();
      setIsPopupActive(false);
      setIsActiveScrapView(false);
      setIsActiveProfileBlock(false);
      setIsActivePostComplaintPopup(false);
      setIsActivePostComplaintCompletePopup(false);
    };
  }, []);

  //   setPostRelationHashMap(new Map());
  //   setCursorIdByPostRelation(INIT_CURSOR_ID);
  //   if (postId) {
  //     getRecommPostRelation(postId, INIT_CURSOR_ID).then((value) => {
  //       const tempSnsRelationHashMap: Map<string, PostRsp> = new Map();
  //       value.snsPostRspList.forEach((snsPostRsp) => {
  //         tempSnsRelationHashMap.set(snsPostRsp.postId, snsPostRsp);
  //       });

  //       setPostRelationHashMap(tempSnsRelationHashMap);
  //       setCursorIdByPostRelation(value.cursorId);
  //     });
  //   }
  // }, [postId]);

  const onClickSettingButton = () => {
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

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const firstPostContent = snsPost?.postContents[0];

  // Ref 관련 변수
  const likeIconRef = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const likeCountRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const commentReplyCountRef = useRef<{ [key: string]: HTMLDivElement | null }>(
    {},
  );
  const postCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 상태 관리 관련 변수
  const [replyMsg, setReplyMsg] = useState<PostCommentReplyMsgInfo | null>(
    null,
  );
  const activeCommentByPostCommentThread = useRecoilValue(
    activeCommentByPostCommentThreadAtom,
  );

  const { data } = QueryStatePostRelationListInfinite(postId || '');

  return (
    <>
      <AppBaseTemplate
        hasSearchBodyModule={false}
        isTransparentSearchButton={true}
        AppContainerStyle={{
          boxShadow: borderShadowStyle_prop,
          borderRadius:
            windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM
              ? ImageBorderRadius
              : ``,
        }}
        slideBarNode={
          <PostReactionPopupBody
            postId={postId || ''}
            snsPost={snsPost}
            likeCountRef={likeCountRef}
            likeIconRef={likeIconRef}
            postCommentTextareaRef={postCommentTextareaRef}
            commentReplyCountRef={commentReplyCountRef}
            replyMsg={replyMsg}
            setReplyMsg={setReplyMsg}
            PostReactionTabStyle={{
              marginTop: '0px',
              paddingTop: `${theme.systemSize.header.heightNumber + 17}px`,
            }}
          />
        }
      >
        {isIntereset ? (
          <ProfilePostContainer>
            <PostPreButtonWrap>
              <PostPreButton
                onClick={() => {
                  navigate(-1);
                }}
              >
                <PostPreButtonIcon />
              </PostPreButton>
            </PostPreButtonWrap>
            <PostImageWrap>
              {/* <PrevButton to="/" style={PrevStyle} /> */}

              <SettingButtonWrap>
                <SettingButton
                  onClick={onClickSettingButton}
                  ref={postSettingButtonRef}
                >
                  <ProfilePostSettingButtonIcon />
                  {windowSize.width > MEDIA_MOBILE_MAX_WIDTH_NUM &&
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

              <StyledSwiper
                spaceBetween={20}
                slidesPerView={1}
                pagination={true}
                loop={true}
                modules={[Pagination, Navigation, FreeMode, Navigation, Thumbs]}
              >
                {snsPost?.postContents.map((value, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      onClick={() => {
                        setPostContentZoomPopupInfoAtom((prev) => ({
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
                      {value.postContentType === POST_VIDEO_TYPE && (
                        <PostVideoContentELement videoSrc={value.content} />
                      )}
                    </SwiperSlide>
                  );
                })}
              </StyledSwiper>
            </PostImageWrap>
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
                  postId={postId}
                  postRspAtom={postRspAtom}
                  funcHeartState={() => {
                    const postBySys = snsSystemPostHashMap.get(postId);
                    if (postBySys) {
                      const tempProfilePostHashMap = new Map(
                        profilePostHashMap,
                      );

                      const tempProfilePost =
                        tempProfilePostHashMap.get(postId);
                      if (tempProfilePost) {
                        tempProfilePostHashMap.set(postId, {
                          ...tempProfilePost,
                          isLiked: !postBySys.isLiked,
                        });
                        setProfilePostHashMap(tempProfilePostHashMap);
                      }
                    }
                  }}
                  funcClipState={() => {
                    onClickClipGlobalState(
                      postId,
                      profilePostHashMap,
                      setProfilePostHashMap,
                      myProfileClipHashMap,
                      setMyProfileClipHashMap,
                      !snsPost.isClipped,
                      {
                        location: snsPost.location,
                        postThumbnailContent: snsPost.postContents[0].content,
                        userId: snsPost.userId,
                        username: snsPost.username,
                        postedAt: snsPost.postedAt,
                      },
                    );
                  }}
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
          </ProfilePostContainer>
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
        <BoundaryBarStick />
        <RelatedPostContainer>
          <RelatedTitle>연관 게시글</RelatedTitle>
          {/* <PostRelationWrap>
          <MasonryLayout
            snsPostUrlList={Array.from(postRelationHashMap.entries())
              .filter(([, v]) => v.postId !== postId)
              .map(([, v]) => {
                const postContent = v.postContents[0];

                const homePostRsp: MasonryPostRsp = {
                  postId: v.postId,
                  userId: v.userId,
                  postContent: postContent.content,
                  postContentType: postContent.postContentType,
                  username: v.username,
                  location: v.location,
                };

                return homePostRsp;
              })}
          />
          {postId && <PostRelationInfiniteScroll postId={postId} />}
        </PostRelationWrap> */}

          {postId && (
            <>
              <PostRelationWrap>
                {data && (
                  <SnsPostMasonryLayout
                    snsPostList={data.pages.flatMap((page) =>
                      page.snsPostRspList.map((v) => v),
                    )}
                  />
                )}
              </PostRelationWrap>
              <PostRelationListInfiniteScroll postId={postId} />
            </>
          )}
        </RelatedPostContainer>

        {windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM &&
          isSettingActive &&
          postId && (
            <>
              <ProfilePostSettingPopup
                postId={postId}
                setIsSettingActive={setIsSettingActive}
                myAccountSettingInfo={myAccountSettingInfo}
                isBlocked={isBlocked}
                userId={snsPost.userId}
                username={snsPost.username}
                setIsInterest={setIsInterest}
              />
            </>
          )}
        {isPopupActive && windowSize.width <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
          <PostReactionPopup postId={reactionPostId} snsPost={snsPost} />
        )}
        {isActiveScrapView && postId !== undefined && firstPostContent && (
          <ScrapViewPopup
            postId={postId}
            postContentUrl={firstPostContent.content}
            postContentType={firstPostContent.postContentType}
            snsPost={snsPost}
            setSnsPost={setSnsPost}
            setIsActiveScrapViewPopup={setIsActiveScrapView}
          />
        )}
        {isActiveProfileBlock && (
          <BlockUserPopup
            userInfo={postBlockedUserInfo}
            isBlocked={isBlocked}
            hasTransparentOverLay={false}
            setIsBlocked={setIsBlocked}
            setIsSettingPopup={setIsSettingActive}
          />
        )}
        {isSharePopup && (
          <SnsSharePopup
            shareLink={window.location.href}
            setIsSharePopup={setIsSharePopup}
          />
        )}
        {postContentZoomPopupInfo.isActive && (
          <PostCotentZoomPopup
            snsPost={snsPost}
            initIndex={postContentZoomPopupInfo.initIndex}
          />
        )}
        {activeCommentByPostCommentThread.isActive && (
          <PostCommentThread
            snsPost={snsPost}
            postCommentTextareaRef={postCommentTextareaRef}
            replyMsg={replyMsg}
            setReplyMsg={setReplyMsg}
            likeIconByCommentRef={likeIconRef}
            likeCountByCommentRef={likeCountRef}
            commentCountByCommentRef={commentReplyCountRef}
          />
        )}
        {isActivePostComplaintPopup && <PostComplaintPopup />}
        {isActivePostComplaintCompletePopup && (
          <PostComplaintCompletePopup
            userInfo={{ userId: snsPost.userId, username: snsPost.username }}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
          />
        )}
        {isLoadingPopup && <LoadingPopup />}

        <ToastMsgPopup />
        <BottomNavBar />
      </AppBaseTemplate>
      <WindowResizeSenceComponent setWindowSize={setWindowSize} />
    </>
  );
};

const ImageBorderRadius = '20px';

const ProfilePostContainer = styled.div`
  position: relative;
  max-width: ${({ theme }) =>
    theme.systemSize.appDisplaySize.profilePostMaxWidth};
  margin: 0 auto;
`;

const PostImgWrap = styled.div`
  width: 100%;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-height: 500px;
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
  border-radius: 30px 30px 0px 0px;

  @media (max-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    border-radius: 30px 30px 0px 0px;
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
  border-radius: 30px;
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
  z-index: 10;
  top: 16px;
  right: 20px;
  cursor: pointer;
`;

const SettingButton = styled.div`
  position: relative;
`;

const NotInerestedMessageWrap = styled.div`
  display: flex;
  flex-flow: column;
  background-color: ${({ theme }) => theme.grey.Grey1};
  padding: 19px 23px;
  border-radius: 8px;
  margin: 50px 10px 10px 10px;
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
  z-index: 100;
  left: 15px;
  top: 15px;
`;

const PostPreButton = styled.div`
  position: fixed;
  cursor: pointer;
`;

const PostRelationWrap = styled.div`
  padding: 15px 11px 0 11px;
`;

export default ProfilePostPage;
