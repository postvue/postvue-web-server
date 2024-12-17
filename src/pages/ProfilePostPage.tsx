import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import PostVideoContentELement from 'components/common/posts/element/PostVideoContentElement';
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
import ScrapViewPopup from '../components/popups/profilescrap/ScrapViewPopup';
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
  isActivePostDeletePopupAtom,
  isSettingPopupAtom,
  postBlockedUserInfoAtom,
  postContentZoomPopupInfoAtom,
  postRspAtom,
} from '../states/PostAtom';
import {
  isPostReactionAtom,
  postReactionTabIdAtom,
  reactionPostIdAtom,
} from '../states/PostReactionAtom';
import {
  isActiveProfileBlockPopupAtom,
  isActiveScrapViewPopupAtom,
} from '../states/ProfileAtom';
import {
  isLoadingPopupAtom,
  systemPostRspHashMapAtom,
} from '../states/SystemConfigAtom';
import theme from '../styles/theme';

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
import SnsPostMasonryLayout from 'components/layouts/SnsPostMasonryLayout';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';
import LoadingPopup from 'components/popups/LoadingPopup';
import PostCommentThreadPopup from 'components/popups/postcommentthreadpopup/PostCommentThreadPopup';
import PostReactionPopupBody from 'components/popups/postreactionpopup/body/PostReactionPopupBody';
import PostComplaintCompletePopup from 'components/popups/profilepost/PostComplaintCompletePopup';
import PostComplaintPopup from 'components/popups/profilepost/PostComplaintPopup';

import PageHelmentInfoElement from 'components/PageHelmetInfoElement';
import ConfirmPopup from 'components/popups/ConfirmPopup';
import PostReactionCommentSendElement from 'components/popups/postreactionpopup/body/PostReactionCommentSendElement';
import PostReactionPopupHeader from 'components/popups/postreactionpopup/body/PostReactionPopupHeader';
import PostCommentComplaintPopup from 'components/popups/profilepost/PostCommentComplaintPopup';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { APP_SERVICE_NAME } from 'const/AppInfoConst';
import { POST_REACTION_COMMENT_ID } from 'const/TabConfigConst';
import { PostCommentReplyMsgInfo } from 'global/interface/post';
import { isUserLoggedIn } from 'global/util/AuthUtil';
import { getRandomImage } from 'global/util/shareUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import ProfileAccountPostListInfiniteScroll from 'hook/ProfileAccountPostListInfiniteScroll';
import { QueryStatePostRelationListInfinite } from 'hook/queryhook/QueryStatePostRelationListInfinite';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { QueryStateProfilePost } from 'hook/queryhook/QueryStateProfilePost';
import { deletePost } from 'services/post/deletePost';
import { activeCommentByPostCommentThreadAtom } from 'states/PostThreadAtom';
import { borderShadowStyle_prop } from 'styles/commonStyles';
const ProfilePostPage: React.FC = () => {
  const postSettingButtonRef = useRef<HTMLDivElement>(null);

  const param = useParams();
  const snsSystemPostHashMap = useRecoilValue(systemPostRspHashMapAtom);
  const postId = param.post_id;
  const user_id = param.user_id;
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const [isSettingActive, setIsSettingActive] =
    useRecoilState(isSettingPopupAtom);
  const [reactionPostId, setReactionPostId] =
    useRecoilState(reactionPostIdAtom);
  const reactionTabId = useRecoilValue(postReactionTabIdAtom);

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

  const [isActiveRelation, setIsActiveRelation] = useState<boolean>(false);

  const { data: profilePostList } = QueryStateProfileAccountPostList(
    snsPost.username,
    isActiveRelation,
  );

  const [
    isActivePostComplaintCompletePopup,
    setIsActivePostComplaintCompletePopup,
  ] = useRecoilState(isActivePostComplaintCompletePopupAtom);

  const [isActivePostDeletePopup, setIsActivePostDeletePopup] = useRecoilState(
    isActivePostDeletePopupAtom,
  );

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

  const { windowWidth } = useWindowSize();

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

  return (
    <>
      <PageHelmentInfoElement
        title={
          (snsPost.postTitle || snsPost.postBodyText) + ' ' + APP_SERVICE_NAME
        }
        ogTitle={snsPost.postTitle || snsPost.postBodyText}
        ogImage={getRandomImage(
          snsPost.postContents
            .filter((v) => v.postContentType === POST_IMAGE_TYPE)
            .map((v) => v.content),
          snsPost.profilePath,
        )}
        ogUrl={window.location.href}
        ogDescription={'안녕하세요 필로그 입니다.'}
      />
      <AppBaseTemplate
        hasSearchBodyModule={false}
        isAppContainerTopMargin={false || !isIntereset}
        isTransparentSearchButton={true}
        AppContainerStyle={{
          borderRadius:
            windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM ? ImageBorderRadius : ``,
        }}
        slideBarNode={
          <>
            {postId && (
              <PostReactionPopupSideWrap>
                <PostReactionPopupHeader
                  PostReactionTabStyle={{
                    marginTop: '0px',
                    paddingTop: `${theme.systemSize.header.heightNumber + 17}px`,
                    flexShrink: '0',
                  }}
                />
                <PostReactionPopupSideBodyWrap>
                  <PostReactionPopupBody
                    postId={postId || ''}
                    likeCountRef={likeCountRef}
                    likeIconRef={likeIconRef}
                    postCommentTextareaRef={postCommentTextareaRef}
                    commentReplyCountRef={commentReplyCountRef}
                    setReplyMsg={setReplyMsg}
                  />
                </PostReactionPopupSideBodyWrap>
                <PostReactionPopupSideInputWrap>
                  {reactionTabId === POST_REACTION_COMMENT_ID && (
                    <PostReactionCommentSendElement
                      postId={postId}
                      postCommentTextareaRef={postCommentTextareaRef}
                      commentReplyCountRef={commentReplyCountRef}
                      username={snsPost.username}
                      replyMsg={replyMsg}
                      setReplyMsg={setReplyMsg}
                    />
                  )}
                </PostReactionPopupSideInputWrap>
              </PostReactionPopupSideWrap>
            )}
          </>
        }
      >
        <ProfilePostContainer>
          {isIntereset ? (
            <ProfilePostWrap>
              <PostPreButtonWrap>
                <PostPreButton
                  onClick={() => {
                    navigate(-1);
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
                  {windowWidth > MEDIA_MOBILE_MAX_WIDTH_NUM &&
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
                            console.log('인덱스', index);
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
                            <PostImgWrap>
                              <PostVideoContentELement
                                videoSrc={value.content}
                                posterImg={value.previewImg}
                                isUploaded={value.isUploaded}
                                PostVideoContentELementStyle={{
                                  maxHeight: `${PostMinHeight}px`,
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
                            windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM
                              ? {
                                  borderRadius: `${PostContentRadis} ${PostContentRadis} 0 0`,
                                }
                              : {}
                          }
                          PostVideoStyle={
                            windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM
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
          <BoundaryBarStick />
          <RelatedPostContainer>
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
                      <SnsPostMasonryLayout
                        snsPostList={postRelationList.pages.flatMap(
                          (page) => page.snsPostRspList,
                        )}
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
                  <SnsPostMasonryLayout
                    snsPostList={profilePostList?.pages
                      .flatMap((value) => value.snsPostRspList)
                      .filter((value) => value.postId !== postId)}
                  />
                  <ProfileAccountPostListInfiniteScroll
                    username={snsPost.username}
                  />
                </PostRelationWrap>
              )}
          </RelatedPostContainer>

          {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && postId && (
            <ProfilePostSettingPopup
              postId={postId}
              myAccountSettingInfo={myAccountSettingInfo}
              isBlocked={isBlocked}
              userId={snsPost.userId}
              username={snsPost.username}
              setIsInterest={setIsInterest}
            />
          )}
          {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM && (
            <PostReactionPopup
              postId={reactionPostId}
              username={snsPost.username}
              replyMsg={replyMsg}
              setReplyMsg={setReplyMsg}
            />
          )}
          {postId !== undefined && firstPostContent && isUserLoggedIn() && (
            <ScrapViewPopup
              postId={postId}
              postContentUrl={firstPostContent.content}
              postContentType={firstPostContent.postContentType}
              snsPost={snsPost}
              setSnsPost={setSnsPost}
              isActiveScrapViewPopup={isActiveScrapView}
              setIsActiveScrapViewPopup={setIsActiveScrapView}
            />
          )}

          <BlockUserPopup
            userInfo={postBlockedUserInfo}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
            setIsSettingPopup={setIsSettingActive}
          />

          <PostCotentZoomPopup
            snsPost={snsPost}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />

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
          <PostComplaintPopup />
          <PostCommentComplaintPopup />
          <PostComplaintCompletePopup
            userInfo={{ userId: snsPost.userId, username: snsPost.username }}
            isBlocked={isBlocked}
            setIsBlocked={setIsBlocked}
          />
          {isActivePostDeletePopup && (
            <ConfirmPopup
              setIsPopup={setIsActivePostDeletePopup}
              confirmPopupTitle={'정말 포스트를 삭제하시곘습니까? '}
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
          <BottomNavBar />
        </ProfilePostContainer>
      </AppBaseTemplate>
    </>
  );
};

const ImageBorderRadius = '20px';
const PostContentRadis = '30px';

const ProfilePostContainer = styled.div`
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) =>
      theme.systemSize.appDisplaySize.profilePostMaxWidth};
    box-shadow: ${borderShadowStyle_prop};
    border-radius: ${ImageBorderRadius};
    margin: 0 auto;
  }
`;

const ProfilePostWrap = styled.div`
  position: relative;

  margin: 0 auto;
  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    margin: 0 10px 0 10px;
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
  z-index: 10;
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
  z-index: 100;
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

const PostReactionPopupSideWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const PostReactionPopupSideBodyWrap = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const PostReactionPopupSideInputWrap = styled.div`
  flex-shrink: 0;
`;

export default ProfilePostPage;
