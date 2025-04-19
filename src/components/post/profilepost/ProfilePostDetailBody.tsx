import React, { useEffect, useRef, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';

import styled from 'styled-components';
import 'swiper/css';
import { Swiper } from 'swiper/react';
import FollowButton from '../../../components/common/buttton/FollowButton';
import PostReactionSingleElement from '../../../components/common/posts/body/PostReactionSingleElement';
import PostTextContent from '../../../components/common/posts/body/PostTextContent';
import PrevButtonHeaderHeader from '../../../components/layouts/PrevButtonHeaderHeader';
import { PROFILE_ACCOUNT_ROUTE_PATH } from '../../../const/PathConst';
import { POST_VIDEO_TYPE } from '../../../const/PostContentTypeConst';
import { removePostByHiddenPostIdList } from '../../../global/util/HiddenPostIdListUtil';
import { isValidString } from '../../../global/util/ValidUtil';
import {
  activePostComplaintCompletePopupAtom,
  activePostComplaintPopupAtom,
  isSettingPopupAtom,
  postContentZoomPopupInfoAtom,
  postExternelEventInfoAtom,
} from '../../../states/PostAtom';
import { isPostReactionAtom } from '../../../states/PostReactionAtom';
import {
  activeProfileBlockPopupInfoAtom,
  activeScrapViewPopupInfoAtom,
  profileDetailInfoPopupAtom,
} from '../../../states/ProfileAtom';
import theme from '../../../styles/theme';

import PostCotentZoomPopup from 'components/popups/postzoom/PostContentZoomPopup';
import {
  MEDIA_MOBILE_MAX_WIDTH,
  MEDIA_MOBILE_MAX_WIDTH_NUM,
} from 'const/SystemAttrConst';
import { postPostInterested } from 'services/post/postPostInterested';
import 'swiper/css/pagination';

import { ReactComponent as PostPreButtonIcon } from 'assets/images/icon/svg/profilepost/PostPreButtonIcon.svg';
import { ReactComponent as ProfilePostSettingButtonIcon } from 'assets/images/icon/svg/profilepost/ProfilePostSettingButtonIcon.svg';
import ContextMenuPopup from 'components/popups/ContextMenuPopup';

import LoadingComponent from 'components/common/container/LoadingComponent';
import { default as SnsPostVirtualMasonryLayout } from 'components/layouts/virtual/masonry/SnsPostVirtualMasonryLayout';
import ProfilePostSettingBody from 'components/post/ProfilePostSettingBody';
import { POST_RELATION_SEARCH_TYPE } from 'const/PostConst';
import {
  PROFILE_POPUP_PARAM,
  PROFILE_POPUP_USERNAME_PARAM,
  TRUE_PARAM,
} from 'const/QueryParamConst';
import { RoutePushEventDateInterface } from 'const/ReactNativeConst';
import { PostRsp } from 'global/interface/post';
import { isApp, stackRouterPush } from 'global/util/reactnative/nativeRouter';
import PostRelationListInfiniteScroll from 'hook/PostRelationInfiniteScroll';
import ProfileAccountPostListInfiniteScroll from 'hook/ProfileAccountPostListInfiniteScroll';
import { QueryStatePostRelationListInfinite } from 'hook/queryhook/QueryStatePostRelationListInfinite';
import { QueryStateProfileAccountPostList } from 'hook/queryhook/QueryStateProfileAccountPostList';
import { borderShadowStyle_prop } from 'styles/commonStyles';
import ProfilePostDetailBodySwiper from './ProfilePostDetailBodySwiper';

interface ProfilePostDetailBodyProps {
  postId: string;
  snsPost: PostRsp;
  isIntereset: boolean;
  setIsInterest: React.Dispatch<React.SetStateAction<boolean>>;
  windowWidthSize: number;
  funcPrevCloseButton: () => void;
  masonryWidth?: number;
  fixNum?: number;
  ProfilePostWrapStyle?: React.CSSProperties;
  PostImageWrapStyle?: React.CSSProperties;
  linkPopupInfo?: {
    isLinkPopup: boolean;
    isReplaced: boolean;
  };
  isErrorProfilePost: boolean;
  searchType?: POST_RELATION_SEARCH_TYPE;
  scrollElement?: Element;
}

const ProfilePostDetailBody: React.FC<ProfilePostDetailBodyProps> = ({
  postId,
  snsPost,
  isIntereset,
  setIsInterest,
  windowWidthSize,
  funcPrevCloseButton,
  masonryWidth,
  fixNum,
  ProfilePostWrapStyle,
  PostImageWrapStyle,
  linkPopupInfo = {
    isLinkPopup: false,
    isReplaced: false,
  },
  isErrorProfilePost,
  searchType,
  scrollElement,
}) => {
  const postSettingButtonRef = useRef<HTMLDivElement>(null);

  const [isSettingActive, setIsSettingActive] =
    useRecoilState(isSettingPopupAtom);

  const setIsPostReactionPopup = useSetRecoilState(isPostReactionAtom);

  const resetActiveScrapViewPopupInfo = useResetRecoilState(
    activeScrapViewPopupInfoAtom,
  );
  const setActiveProfileBlockInfo = useSetRecoilState(
    activeProfileBlockPopupInfoAtom,
  );

  const resetActivePostComplaintPopup = useResetRecoilState(
    activePostComplaintPopupAtom,
  );
  const resetActivePostComplaintCompletePopup = useResetRecoilState(
    activePostComplaintCompletePopupAtom,
  );

  const [postContentZoomPopupInfo, setPostContentZoomPopupInfo] =
    useRecoilState(postContentZoomPopupInfoAtom);

  const [isActiveRelation, setIsActiveRelation] = useState<boolean>(false);

  const { data: profilePostList } = QueryStateProfileAccountPostList(
    snsPost.username,
    isActiveRelation,
  );

  const profileDetailInfo = useRecoilValue(profileDetailInfoPopupAtom);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setIsPostReactionPopup(false);
      resetActiveScrapViewPopupInfo();
      setActiveProfileBlockInfo({ isActive: false, userId: '', username: '' });
      resetActivePostComplaintPopup();
      resetActivePostComplaintCompletePopup();
    };
  }, []);

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

  const {
    data: postRelationList,
    isFetched: isFetchedByPostRelationList,
    isLoading: isLoadingByPostRelationList,
  } = QueryStatePostRelationListInfinite(postId || '', searchType);

  useEffect(() => {
    if (!isFetchedByPostRelationList || !postRelationList) return;
    if (postRelationList.pages.flatMap((value) => value).length <= 0) {
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
      if (windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM) {
        setIsPopupRendered(true);
      } else {
        setTimeout(() => {
          setIsPopupRendered(true);
        }, 700);
      }
    } else {
      setIsPopupRendered(false);
    }

    return () => {
      setIsPopupRendered(false);
      resetPostExternelEventInfo();
    };
  }, [postId]);

  const setPostExternelEventInfo = useSetRecoilState(postExternelEventInfoAtom);
  const resetPostExternelEventInfo = useResetRecoilState(
    postExternelEventInfoAtom,
  );

  return (
    <>
      <ProfilePostContainer>
        <div ref={elementRef}>
          {isIntereset && !isErrorProfilePost && (
            <ProfilePostWrap style={ProfilePostWrapStyle}>
              <PostPreButtonWrap>
                <PostPreButton
                  onClick={() => {
                    funcPrevCloseButton();
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
                        onClose={() => setIsSettingActive(false)}
                        contextMenuRef={postSettingButtonRef.current}
                      >
                        <ProfilePostSettingBody
                          postId={postId}
                          type={
                            snsPost.postContents.some(
                              (v) => v.postContentType === POST_VIDEO_TYPE,
                            )
                              ? 'video'
                              : 'image'
                          }
                          onClose={() => setIsSettingActive(false)}
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
              {/* <Suspense
                fallback={<Skeleton height={400} style={PostImageWrapStyle} />}
              > */}
              <ProfilePostDetailBodySwiper
                postId={postId}
                snsPost={snsPost}
                windowWidthSize={windowWidthSize}
                PostImageWrapStyle={PostImageWrapStyle}
              />
              {/* </Suspense> */}

              <PostContentContainer>
                <ProfileWrap>
                  <ProfileLinkDiv
                    onClick={() => {
                      setPostExternelEventInfo((prev) => ({
                        ...prev,
                        isClosePost: true,
                      }));

                      const searchParams = new URLSearchParams();
                      searchParams.set('postId', postId);
                      if (
                        isApp() ||
                        windowWidthSize > MEDIA_MOBILE_MAX_WIDTH_NUM
                      ) {
                        const path = generatePath(PROFILE_ACCOUNT_ROUTE_PATH, {
                          username: snsPost.username,
                        });

                        // const queryParams = new URLSearchParams({
                        //   postId: postId,
                        // }).toString();
                        const newSearch = searchParams.toString();

                        const fullPath = `${path}?${newSearch}`;

                        const data: RoutePushEventDateInterface = {
                          isShowInitBottomNavBar: true,
                        };
                        stackRouterPush(navigate, fullPath, data);
                      } else {
                        // 새로운 쿼리 파라미터 추가 또는 기존 파라미터 값 수정
                        searchParams.set(PROFILE_POPUP_PARAM, TRUE_PARAM);
                        searchParams.set(
                          PROFILE_POPUP_USERNAME_PARAM,
                          snsPost.username,
                        );
                        // 새로운 쿼리 파라미터가 포함된 URL 생성
                        const newSearch = searchParams.toString();
                        const newPath = `${location.pathname}?${newSearch}`;

                        if (profileDetailInfo.username === snsPost.username) {
                          navigate(-1);
                        } else {
                          navigate(newPath);
                        }
                      }
                    }}
                  >
                    <ProfileImg src={snsPost?.profilePath} />
                    <ProfileUserNameFollowWrap>
                      <ProfileFollowButtonWrap>
                        <ProfileUserName>{snsPost?.username}</ProfileUserName>
                        {snsPost?.followable ? (
                          <FollowButton
                            userId={snsPost.userId}
                            username={snsPost.username}
                            postId={snsPost.postId}
                            fontSize={theme.fontSizes.Subhead2}
                            style={FollowStyle}
                            isFollow={snsPost.isFollowed}
                          />
                        ) : (
                          <></>
                        )}
                      </ProfileFollowButtonWrap>
                      <ProfilePositionWrap>
                        <ProfilePosition>
                          {snsPost.location.address
                            ? snsPost.location.address
                            : snsPost.location.buildName}
                        </ProfilePosition>
                      </ProfilePositionWrap>
                    </ProfileUserNameFollowWrap>
                  </ProfileLinkDiv>
                </ProfileWrap>

                {postId && (
                  <PostReactionSingleElement
                    username={snsPost.username}
                    postId={snsPost.postId}
                    snsPost={snsPost}
                    onClickCloseVideo={() => {
                      setPostExternelEventInfo((prev) => ({
                        ...prev,
                        isClosePost: true,
                      }));
                    }}
                  />
                )}

                <PostTextContent
                  postTitle={snsPost.postTitle}
                  postBodyText={snsPost.postBodyText}
                  postedAt={snsPost.postedAt}
                  tags={snsPost.tags}
                  isExpandedBodyText={false}
                />
              </PostContentContainer>
            </ProfilePostWrap>
          )}

          {!isErrorProfilePost && !isIntereset && (
            <>
              <PrevButtonHeaderHeader
                titleName=""
                HeaderLayoutStyle={PreButtonHeaderStyle}
              />
              <HiddenWrap>
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
              </HiddenWrap>
            </>
          )}
          {isErrorProfilePost && (
            <>
              <PrevButtonHeaderHeader
                titleName=""
                HeaderLayoutStyle={PreButtonHeaderStyle}
              />
            </>
          )}
        </div>
        <BoundaryBarStick />
        <RelatedPostContainer>
          <RelatedTitle>연관 게시물</RelatedTitle>
          {isPopupRendered ? (
            <>
              {postId && (
                <>
                  {postRelationList &&
                    isFetchedByPostRelationList &&
                    postRelationList?.pages.flatMap((value) => value).length >
                      0 &&
                    !isLoadingByPostRelationList && (
                      <PostRelationWrap>
                        {/* <SnsPostMasonryLayout
                          snsPostList={postRelationList.pages.flatMap(
                            (page) => page,
                          )}
                          isAutoPlay={!isVisible}
                          linkPopupInfo={linkPopupInfo}
                          fixNum={fixNum}
                          searchType={searchType}
                        /> */}
                        {/* 
                        <PostRelationListInfiniteScroll
                          postId={postId}
                          searchType={searchType}
                        /> */}
                        <SnsPostVirtualMasonryLayout
                          snsPostList={postRelationList.pages.flatMap(
                            (page) => page,
                          )}
                          isAutoPlay={!isVisible}
                          linkPopupInfo={linkPopupInfo}
                          searchType={searchType}
                          scrollElement={scrollElement}
                          inViewElement={
                            <PostRelationListInfiniteScroll
                              postId={postId}
                              searchType={searchType}
                            />
                          }
                          masonryWidth={masonryWidth}
                          columnNum={fixNum}
                        />
                      </PostRelationWrap>
                    )}
                </>
              )}
              {isFetchedByPostRelationList &&
                postRelationList &&
                profilePostList &&
                postRelationList?.pages.flatMap((value) => value).length <=
                  0 && (
                  <PostRelationWrap>
                    {/* <SnsPostMasonryLayout
                      snsPostList={profilePostList?.pages
                        .flatMap((value) => value.snsPostRspList)
                        .filter((value) => value.postId !== postId)}
                      isAutoPlay={!isVisible}
                      fixNum={fixNum}
                      linkPopupInfo={linkPopupInfo}
                    /> */}
                    {/* <ProfileAccountPostListInfiniteScroll
                      username={snsPost.username}
                    /> */}
                    <SnsPostVirtualMasonryLayout
                      snsPostList={profilePostList?.pages
                        .flatMap((value) => value.snsPostRspList)
                        .filter((value) => value.postId !== postId)}
                      linkPopupInfo={linkPopupInfo}
                      scrollElement={scrollElement}
                      inViewElement={
                        <ProfileAccountPostListInfiniteScroll
                          username={snsPost.username}
                        />
                      }
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
      </ProfilePostContainer>

      {postContentZoomPopupInfo.isActive && <PostCotentZoomPopup />}
    </>
  );
};

const ImageBorderRadius = '20px';
const PostContentRadis = '30px';

const ProfilePostContainer = styled.div``;

const ProfilePostWrap = styled.div`
  padding-top: env(safe-area-inset-top);
  position: relative;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    max-width: ${({ theme }) =>
      theme.systemSize.appDisplaySize.profilePostMaxWidth};
    box-shadow: ${borderShadowStyle_prop};
    border-radius: ${ImageBorderRadius};
    margin: 10px auto 15px auto;
    padding: 0px 10px 10px 10px;
  }
`;

const HiddenWrap = styled.div`
  padding-top: env(safe-area-inset-top);
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
    aspect-ratio: 1 / 1;
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

const ProfilePositionWrap = styled.div`
  width: 100%;
`;

const ProfilePosition = styled.div`
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey6};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  width: 280px;
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
  // z-index: 1010;
  z-index: 990;
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
  backgroundColor: 'transparent',
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
  position: fixed;
  // z-index: 1010;
  z-index: 990;
`;

const PostPreButton = styled.div`
  position: fixed;
  cursor: pointer;
  padding: 15px;

  @media (min-width: ${MEDIA_MOBILE_MAX_WIDTH}) {
    padding-left: 5px;
  }
`;

const PostRelationWrap = styled.div`
  padding-top: 15px;
`;

const StylePostPreButtonIcon = styled(PostPreButtonIcon)`
  vertical-align: bottom;
`;

const StyleProfilePostSettingButtonIcon = styled(ProfilePostSettingButtonIcon)`
  vertical-align: bottom;
`;

export default ProfilePostDetailBody;
