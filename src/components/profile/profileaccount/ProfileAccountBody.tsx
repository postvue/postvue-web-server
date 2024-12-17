import ScrapViewPopup from 'components/popups/profilescrap/ScrapViewPopup';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { Swiper } from 'swiper/react';
import {
  POST_IMAGE_TYPE,
  POST_VIDEO_TYPE,
} from '../../../const/PostContentTypeConst';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../../../states/PostReactionAtom';
import {
  isActiveProfileBlockPopupAtom,
  isActiveScrapViewPopupAtom,
} from '../../../states/ProfileAtom';
import PostReactionListElement from '../../common/posts/body/PostReactionListElement';
import PostTextContent from '../../common/posts/body/PostTextContent';
import PostReactionPopup from '../../popups/postreactionpopup/PostReactionPopup';

import BlockUserPopup from 'components/popups/BlockUserPopup';
import PostCommentThreadPopup from 'components/popups/postcommentthreadpopup/PostCommentThreadPopup';
import ProfileOtherAccountPopup from 'components/popups/profileaccount/ProfileOtherAccountPopup';
import { MEDIA_MOBILE_MAX_WIDTH } from 'const/SystemAttrConst';
import { PostCommentReplyMsgInfo, PostRsp } from 'global/interface/post';
import { getRandomImage } from 'global/util/shareUtil';
import ProfileAccountPostListInfiniteScroll from 'hook/ProfileAccountPostListInfiniteScroll';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import { PostRspDefaultValue } from 'states/PostAtom';
import { activeCommentByPostCommentThreadAtom } from 'states/PostThreadAtom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';

import { ReactComponent as LeftScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/LeftScrollXButton35x35Icon.svg';
import { ReactComponent as RightScrollXButtonIcon } from 'assets/images/icon/svg/scrollx/RightScrollXButton35x35Icon.svg';
import ScrollXMoveButtonContainer from 'components/common/buttton/ScrollXMoveButtonContainer';
import PostVideoContentELement from 'components/common/posts/element/PostVideoContentElement';
import ProfileAccountInfo from '../profileaccountbody/ProfileAccountInfo';
import ProfileAccountContentMemo from './ProfileAccountContentMemo';

const ProfileAccountBody: React.FC = () => {
  const navigate = useNavigate();
  const reactionPostId = useRecoilValue(reactionPostIdAtom);
  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);

  const param = useParams();
  const username = param.username || '';

  const { data: snsProfilePostList } = QueryStateProfileAccountPostList(
    username || '',
  );

  const [isActiveScrapViewPopup, setIsActiveScrapViewPopup] = useRecoilState(
    isActiveScrapViewPopupAtom,
  );

  const isActiveProfileBlockPopup = useRecoilValue(
    isActiveProfileBlockPopupAtom,
  );

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

  const { data } = QueryStateProfileInfo(username);

  useEffect(() => {
    return () => {
      // resetIsPostReactionPopup();
      setIsPopupActive(false);
      setIsActiveScrapViewPopup(false);
    };
  }, []);

  const [snsPost, setSnsPost] = useState<PostRsp>(PostRspDefaultValue);

  useEffect(() => {
    snsProfilePostList?.pages
      .flatMap((value) => value.snsPostRspList)
      .forEach((snsPostRsp) => {
        if (snsPostRsp.postId === reactionPostId) {
          setSnsPost({ ...snsPostRsp });
        }
      });
  }, [reactionPostId]);

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
      <ProfileAccountBodyContainer>
        <ProfileAccountInfo />
        {data && data.isBlocked && (
          <ProfileBlockMessageTitle>
            @{data.username} 님이 차단되었습니다.
          </ProfileBlockMessageTitle>
        )}

        {data && !data.isBlocked && (
          <ProfilePostListContainer>
            {containerRefs &&
              profilePostList?.map((v, k) => {
                return (
                  <ProfilePostContent key={k}>
                    <ProfilePostContainer
                      onClick={() => navigate(`/${v.username}/${v.postId}`)}
                    >
                      <>
                        {v.postContents.length > 1 ? (
                          <ScrollXMoveButtonContainer
                            scrollContainerRef={containerRefs[k]}
                            leftMoveNum={200}
                            LeftScrollXButtonStyle={{ left: '-20px' }}
                            RightScrollXButtonStyle={{ right: '-20px' }}
                            ScrollLeftIcon={<LeftScrollXButtonIcon />}
                            ScrollRightIcon={<RightScrollXButtonIcon />}
                          >
                            <ProfileScrapImgListWrap ref={containerRefs[k]}>
                              {v.postContents.map((value, i) => (
                                <ProfileAccountContentMemo key={k * 10 + i}>
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
                                  aspectRatio: '3/4',
                                  objectFit: 'cover',
                                }}
                                posterImg={v.postContents[0].previewImg}
                                videoSrc={v.postContents[0].content}
                                isUploaded={v.postContents[0].isUploaded}
                                isVisibilityDetection={true}
                              />
                            )}
                          </>
                        )}
                      </>

                      {/* <StyledSwiper
                        spaceBetween={0}
                        // slidesPerView={1}
                        pagination={true}
                        // loop={v.postContents.length > 1}
                        modules={[
                          Pagination,
                          Navigation,
                          FreeMode,
                          Navigation,
                          Thumbs,
                        ]}
                      >
                        {v.postContents.map((value, i) => {
                          return (
                            <SwiperSlide key={i}>
                              <ProfilePostImgWrap>
                                {value.postContentType === POST_IMAGE_TYPE && (
                                  <ProfilePostImg src={value.content} />
                                )}
                                {value.postContentType === POST_VIDEO_TYPE && (
                                  <PostVideoContentELement
                                    PostVideoContentELementStyle={{
                                      backgroundColor: 'transparent',
                                    }}
                                    PostVideoStyle={{
                                      aspectRatio: '3/4',
                                      objectFit: 'cover',
                                    }}
                                    videoSrc={value.content}
                                    posterImg={value.previewImg}
                                    isVisibilityDetection={true}
                                    onVideoError={() => {
                                      ('');
                                    }}
                                  />
                                )}
                              </ProfilePostImgWrap>
                            </SwiperSlide>
                          );
                        })}
                      </StyledSwiper> */}
                      {/* <SliderLayout
                        listLength={v.postContents.length}
                        actionFuncByNotScroll={() =>
                          navigate(`/${v.username}/${v.postId}`)
                        }
                      >
                        {v.postContents.map((value, i) => {
                          return (
                            <ProfilePostImgWrap key={`${i}_id`}>
                              {value.postContentType === POST_IMAGE_TYPE && (
                                <ProfilePostImg src={value.content} />
                              )}
                              {value.postContentType === POST_VIDEO_TYPE && (
                                <PostVideoContentELement
                                  PostVideoStyle={{
                                    aspectRatio: '3/4',
                                    objectFit: 'cover',
                                  }}
                                  videoSrc={value.content}
                                  isVisibilityDetection={true}
                                />
                              )}
                            </ProfilePostImgWrap>
                          );
                        })}
                      </SliderLayout> */}

                      <PostReactionListElement
                        username={v.username}
                        postId={v.postId}
                        mainImageUrl={getRandomImage(
                          v.postContents
                            .filter(
                              (v) => v.postContentType === POST_IMAGE_TYPE,
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
                      />
                    </ProfilePostContainer>
                    {/* <BoundaryStickBar /> */}
                  </ProfilePostContent>
                );
              })}
            {username && (
              <ProfileAccountPostListInfiniteScroll username={username} />
            )}
            {profilePostList && profilePostList.length <= 0 && (
              <ProfileNotPostTitle>
                아직 등록한 게시물이 없네요...
              </ProfileNotPostTitle>
            )}
          </ProfilePostListContainer>
        )}

        <PostReactionPopup
          postId={reactionPostId}
          username={snsPost.username}
          replyMsg={replyMsg}
          setReplyMsg={setReplyMsg}
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
        {isActiveScrapViewPopup &&
          reactionPostId &&
          snsPost?.postContents !== undefined && (
            <ScrapViewPopup
              postId={reactionPostId}
              postContentUrl={snsPost?.postContents[0].content || ''}
              postContentType={snsPost?.postContents[0].postContentType || ''}
              snsPost={snsPost}
              setSnsPost={setSnsPost}
              isActiveScrapViewPopup={isActiveScrapViewPopup}
              setIsActiveScrapViewPopup={setIsActiveScrapViewPopup}
            />
          )}
      </ProfileAccountBodyContainer>

      <ProfileOtherAccountPopup />
      {isActiveProfileBlockPopup && data && (
        <BlockUserPopup
          isBlocked={data.isBlocked}
          userInfo={{ username: data.username, userId: data.userId }}
        />
      )}
    </>
  );
};

const ProfileAccountBodyContainer = styled.div``;

const ProfileBlockMessageTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  position: fixed;
  transform: translate(-50%, 50%);
  top: 50%;
  left: 50%;
`;

const ProfilePostListContainer = styled.div`
  padding-top: 26px;
  display: flex;
  flex-flow: column;
  gap: 20px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) =>
      theme.systemSize.appDisplaySize.profilePostMaxWidth};
    margin: 0 auto;
  }
`;

const ProfilePostContent = styled.div``;

const ProfilePostContainer = styled.div`
  cursor: pointer;
  margin: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
    0px ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
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

const ProfileNotPostTitle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  font: ${({ theme }) => theme.fontSizes.Body5};
`;

export default ProfileAccountBody;
