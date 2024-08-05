import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';

import anime from 'animejs';
import styled from 'styled-components';
import 'swiper/css';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import TabBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import PostReactionPopup from '../components/popups/PostReactionPopup';
import ToastMsgPopup, { notify } from '../components/popups/ToastMsgPopup';
import PrevButton from '../components/PrevButton';
import { INIT_SCROLL_POSITION } from '../const/AttributeConst';
import { TAG_SEARCH_PATH } from '../const/PathConst';
import { POST_TEXTFIELD_TYPE } from '../const/PostContentTypeConst';
import { PROFILE_URL_CLIP_BOARD_TEXT } from '../const/SystemPhraseConst';
import { convertDtStrToDTStr } from '../global/util/DateTimeUtil';
import { getPost } from '../services/post/getPost';
import { putPostClip } from '../services/post/putPostClip';
import { putPostLike } from '../services/post/putPostLike';
import { postRspAtom } from '../states/PostAtom';
import { isPostReactionPopupAtom } from '../states/PostReactionAtom';
import { systemPostRspHashMapAtom } from '../states/SystemConfigAtom';
import { animationStyle } from '../styles/animations';
import theme from '../styles/theme';

const ProfilePage: React.FC = () => {
  const param = useParams();
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );
  const postId = param.post_id;
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const [isSettingActive, setIsSettingActive] = useState<boolean>(false);
  const [isPostReactionPopup, setIsPostReactionPopup] = useRecoilState(
    isPostReactionPopupAtom,
  );
  const resetIsPostReactionPopup = useResetRecoilState(isPostReactionPopupAtom);
  const resetSnsPost = useResetRecoilState(postRspAtom);

  useEffect(() => {
    window.scrollTo({ top: INIT_SCROLL_POSITION });
    if (postId) {
      const selectedPost = snsSystemPostHashMap.get(postId);
      if (selectedPost) {
        setSnsPost(selectedPost);
      } else {
        getPost(postId)
          .then((v) => {
            setSnsPost(v);
          })
          .catch((err) => {
            throw err;
          });
      }
    }

    return () => {
      resetIsPostReactionPopup();
      resetSnsPost();
    };
  }, []);

  const heartRef = useRef(null);
  const onClickHeartButton = () => {
    if (postId) {
      putPostLike(postId)
        .then((value) => {
          const newSnsPostCommentHashMap = new Map(snsSystemPostHashMap);
          const snsPostComment = newSnsPostCommentHashMap.get(postId);
          if (snsPostComment !== undefined) {
            newSnsPostCommentHashMap.set(postId, {
              ...snsPostComment,
              isLiked: value.isLike,
            });
          }
          setSnsSystemPostHashMap(newSnsPostCommentHashMap);

          setSnsPost((prev) => ({ ...prev, isLiked: value.isLike }));
          if (value.isLike) {
            anime({
              targets: heartRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const clipRef = useRef(null);
  const onClickClipButton = () => {
    if (postId) {
      putPostClip(postId)
        .then((value) => {
          setSnsPost((prev) => ({ ...prev, isClipped: value.isClipped }));
          if (value.isClipped) {
            anime({
              targets: clipRef.current,
              scale: [1, 1.5],
              duration: 300,
              easing: 'easeInOutQuad',
              direction: 'alternate',
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  const onClickSettingButton = () => {
    setIsSettingActive(true);
  };
  const onClickPopupContainer = () => {
    setIsSettingActive(false);
  };
  async function onClickClipBoardCopyButton(copyText: string) {
    try {
      await navigator.clipboard.writeText(copyText);
      notify(PROFILE_URL_CLIP_BOARD_TEXT);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <AppBaseTemplate>
      <PostImageWrap>
        <PrevButton to="/" style={PrevStyle} />
        <SettingButton onClick={onClickSettingButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 4.5C11.7348 4.5 11.4804 4.60536 11.2929 4.79289C11.1054 4.98043 11 5.23478 11 5.5C11 5.76522 11.1054 6.01957 11.2929 6.20711C11.4804 6.39464 11.7348 6.5 12 6.5C12.2652 6.5 12.5196 6.39464 12.7071 6.20711C12.8946 6.01957 13 5.76522 13 5.5C13 5.23478 12.8946 4.98043 12.7071 4.79289C12.5196 4.60536 12.2652 4.5 12 4.5Z"
              fill="white"
            />
            <path
              d="M12 10.9999C11.7348 10.9999 11.4804 11.1053 11.2929 11.2928C11.1054 11.4804 11 11.7347 11 11.9999C11 12.2651 11.1054 12.5195 11.2929 12.707C11.4804 12.8946 11.7348 12.9999 12 12.9999C12.2652 12.9999 12.5196 12.8946 12.7071 12.707C12.8946 12.5195 13 12.2651 13 11.9999C13 11.7347 12.8946 11.4804 12.7071 11.2928C12.5196 11.1053 12.2652 10.9999 12 10.9999Z"
              fill="white"
            />
            <path
              d="M12 17.5C11.7348 17.5 11.4804 17.6054 11.2929 17.7929C11.1054 17.9804 11 18.2348 11 18.5C11 18.7652 11.1054 19.0196 11.2929 19.2071C11.4804 19.3946 11.7348 19.5 12 19.5C12.2652 19.5 12.5196 19.3946 12.7071 19.2071C12.8946 19.0196 13 18.7652 13 18.5C13 18.2348 12.8946 17.9804 12.7071 17.7929C12.5196 17.6054 12.2652 17.5 12 17.5Z"
              fill="white"
            />
            <path
              d="M12 4.5C11.7348 4.5 11.4804 4.60536 11.2929 4.79289C11.1054 4.98043 11 5.23478 11 5.5C11 5.76522 11.1054 6.01957 11.2929 6.20711C11.4804 6.39464 11.7348 6.5 12 6.5C12.2652 6.5 12.5196 6.39464 12.7071 6.20711C12.8946 6.01957 13 5.76522 13 5.5C13 5.23478 12.8946 4.98043 12.7071 4.79289C12.5196 4.60536 12.2652 4.5 12 4.5Z"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 10.9999C11.7348 10.9999 11.4804 11.1053 11.2929 11.2928C11.1054 11.4804 11 11.7347 11 11.9999C11 12.2651 11.1054 12.5195 11.2929 12.707C11.4804 12.8946 11.7348 12.9999 12 12.9999C12.2652 12.9999 12.5196 12.8946 12.7071 12.707C12.8946 12.5195 13 12.2651 13 11.9999C13 11.7347 12.8946 11.4804 12.7071 11.2928C12.5196 11.1053 12.2652 10.9999 12 10.9999Z"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17.5C11.7348 17.5 11.4804 17.6054 11.2929 17.7929C11.1054 17.9804 11 18.2348 11 18.5C11 18.7652 11.1054 19.0196 11.2929 19.2071C11.4804 19.3946 11.7348 19.5 12 19.5C12.2652 19.5 12.5196 19.3946 12.7071 19.2071C12.8946 19.0196 13 18.7652 13 18.5C13 18.2348 12.8946 17.9804 12.7071 17.7929C12.5196 17.6054 12.2652 17.5 12 17.5Z"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SettingButton>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          speed={700}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          modules={[Pagination, Navigation, FreeMode, Navigation, Thumbs]}
        >
          {snsPost?.postContents.map((value, index) => {
            if (value.postContentType !== POST_TEXTFIELD_TYPE) {
              return (
                <SwiperSlide key={index}>
                  <PostImgWrap>
                    <PostImgDiv src={value.content} />
                  </PostImgWrap>
                </SwiperSlide>
              );
            }
          })}
        </Swiper>
      </PostImageWrap>

      <PostContentContainer>
        <ProfileWrap>
          <Link to={`/${snsPost?.userId}`}>
            <ProfileLinkDiv>
              <ProfileImg src={snsPost?.profilePath} />
              <ProfileUserNameFollowWrap>
                <ProfileUserName>{snsPost?.userId}</ProfileUserName>
                <ProfilePosition>성수동 I 1km</ProfilePosition>
              </ProfileUserNameFollowWrap>
            </ProfileLinkDiv>
          </Link>
          {snsPost?.isFollowed ? (
            <ProfileFollowButton>팔로우</ProfileFollowButton>
          ) : (
            <></>
          )}
        </ProfileWrap>

        <ReactionContainer>
          <HrtMsgShrReactionContainer>
            <HeartButton onClick={onClickHeartButton}>
              <svg
                ref={heartRef}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={snsPost?.isLiked ? theme.mainColor.Red : 'none'}
              >
                <path
                  d="M19.4998 12.5722L11.9998 20.0002L4.49981 12.5722C4.00512 12.0908 3.61546 11.5122 3.35536 10.8728C3.09527 10.2334 2.97037 9.54713 2.98855 8.85711C3.00673 8.16709 3.16758 7.48831 3.46097 6.86351C3.75436 6.23871 4.17395 5.68143 4.6933 5.22676C5.21265 4.77208 5.82052 4.42987 6.47862 4.22166C7.13673 4.01345 7.83082 3.94376 8.51718 4.01698C9.20354 4.0902 9.86731 4.30473 10.4667 4.64708C11.0661 4.98943 11.5881 5.45218 11.9998 6.00618C12.4133 5.4562 12.9359 4.9975 13.5349 4.65878C14.1339 4.32007 14.7963 4.10863 15.4807 4.0377C16.1652 3.96677 16.8569 4.03787 17.5126 4.24657C18.1683 4.45526 18.7738 4.79705 19.2914 5.25054C19.8089 5.70403 20.2272 6.25946 20.5202 6.88207C20.8132 7.50468 20.9746 8.18106 20.9941 8.86889C21.0137 9.55671 20.8911 10.2412 20.6339 10.8794C20.3768 11.5177 19.9907 12.096 19.4998 12.5782"
                  stroke={
                    snsPost?.isLiked ? theme.mainColor.Red : theme.grey.Grey7
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </HeartButton>
            <MsgButton
              onClick={() => {
                setIsPostReactionPopup(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8 9H16M8 13H14M9 18H6C5.20435 18 4.44129 17.6839 3.87868 17.1213C3.31607 16.5587 3 15.7956 3 15V7C3 6.20435 3.31607 5.44129 3.87868 4.87868C4.44129 4.31607 5.20435 4 6 4H18C18.7956 4 19.5587 4.31607 20.1213 4.87868C20.6839 5.44129 21 6.20435 21 7V15C21 15.7956 20.6839 16.5587 20.1213 17.1213C19.5587 17.6839 18.7956 18 18 18H15L12 21L9 18Z"
                  stroke="#535B63"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </MsgButton>
            <ShareButton
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_149_3173)">
                <path
                  d="M18.3332 1.6665L9.1665 10.8332"
                  stroke="#535B63"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 1.6665L12.4998 18.3332L9.1665 10.8332L1.6665 7.49984L18.3332 1.6665Z"
                  stroke="#535B63"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_149_3173">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </ShareButton>
          </HrtMsgShrReactionContainer>
          <ClipButton onClick={onClickClipButton}>
            <svg
              ref={clipRef}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={snsPost?.isClipped ? theme.grey.Grey6 : 'none'}
            >
              <path
                d="M18 7V19.1315C18 19.9302 17.1099 20.4066 16.4453 19.9635L12 17L7.5547 19.9635C6.89014 20.4066 6 19.9302 6 19.1315V7C6 5.93913 6.42143 4.92172 7.17157 4.17157C7.92172 3.42143 8.93913 3 10 3H14C15.0609 3 16.0783 3.42143 16.8284 4.17157C17.5786 4.92172 18 5.93913 18 7Z"
                stroke={theme.grey.Grey6}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ClipButton>
        </ReactionContainer>

        {snsPost?.postContents.map((value, index) => {
          if (value.postContentType === POST_TEXTFIELD_TYPE) {
            return (
              <PostTextContent key={index}>{value.content}</PostTextContent>
            );
          }
        })}
        <PostDateTime>
          {convertDtStrToDTStr(snsPost?.postedAt || '')}
        </PostDateTime>
        <PostTagWrap>
          {snsPost?.tags.map((v, i) => (
            <Link to={`${TAG_SEARCH_PATH}/${v}`} key={i}>
              <PostTag>#{v}</PostTag>
            </Link>
          ))}
        </PostTagWrap>

        {/* <div>{snsPost?.location.latitude}</div>
        <div>{snsPost?.location.longitude}</div> */}
        <div>{snsPost?.isClipped}</div>
      </PostContentContainer>
      <BoundaryBarStick />
      <RelatedPostContainer>
        <RelatedTitle>연관 게시글</RelatedTitle>
      </RelatedPostContainer>

      {isSettingActive && (
        <SettingPopupContainer onClick={onClickPopupContainer}>
          <SettingPopupWrap
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <SettingPopupContentWrap>
              <SettingPopupContent
                onClick={() => {
                  setIsSettingActive(false);
                  onClickClipBoardCopyButton(window.location.href);
                }}
              >
                게시물 링크 복사
              </SettingPopupContent>
              <SettingPopupContent>관심 없음</SettingPopupContent>
              <SettingPopupContent>게시물 신고</SettingPopupContent>
              <SettingPopupContent>사용자 차단</SettingPopupContent>
            </SettingPopupContentWrap>
          </SettingPopupWrap>
        </SettingPopupContainer>
      )}
      {isPostReactionPopup && <PostReactionPopup />}

      <ToastMsgPopup />
      <TabBar />
    </AppBaseTemplate>
  );
};

const PostImgWrap = styled.div`
  max-height: 500px;
  width: 100%;
  aspect-ratio: 1 / 1.5;
`;

const PostImgDiv = styled.div<{ src: string }>`
  width: 100%;
  height: 100%;
  vertical-align: bottom;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0.15%, rgba(0, 0, 0, 0) 49.86%),
    url(${(props) => props.src}) center center / cover;
`;

const PostImageWrap = styled.div`
  position: relative;
`;

const PostContentContainer = styled.div`
  padding-top: 15px;
  padding-left: 20px;
  padding: 15px 0 0 20px;
`;

const ProfileWrap = styled.div`
  display: flex;
`;

const ProfileLinkDiv = styled.div`
  display: flex;
`;

const ProfileImg = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 20px;
`;

const ProfileUserNameFollowWrap = styled.div`
  padding: 0 6px 0 8px;
`;

const ProfileUserName = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;
const ProfileFollowButton = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead1};
  color: ${({ theme }) => theme.mainColor.Blue};
  line-height: 190%;
  cursor: pointer;
`;
const ProfilePosition = styled.div`
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey6};
`;

const PostTextContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body2};
`;
const PostDateTime = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey6};
  margin: 15px 0 15px 0;
`;

const ReactionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 17px 14px 8px 0;
`;

const HrtMsgShrReactionContainer = styled.div`
  display: flex;
  gap: 9px;
`;

const BoundaryBarStick = styled.div`
  background-color: ${({ theme }) => theme.grey.Grey1};
  height: 1px;
`;

const RelatedPostContainer = styled.div`
  padding: 14px 0 0 22px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;

const HeartButton = styled.div`
  cursor: pointer;
`;

const MsgButton = styled.div`
  cursor: pointer;
`;

const ShareButton = styled.svg`
  margin: auto 0;
`;

const ClipButton = styled.div`
  cursor: pointer;
`;

const PostTagWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;
const PostTag = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body1};
  color: ${({ theme }) => theme.grey.Grey5};
  cursor: pointer;
`;

const RelatedTitle = styled.div``;

const PrevStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 10,
  left: '15px',
  top: '16px',
};

const SettingButton = styled.div`
  position: absolute;
  z-index: 10;
  top: 16px;
  right: 20px;
  cursor: pointer;
`;

const SettingPopupContainer = styled.div`
  max-width: ${({ theme }) => theme.appDisplaySize};
  position: fixed;
  z-index: 999;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const SettingPopupWrap = styled.div`
  bottom: 0;
  z-index: 20;
  height: 297px;

  padding-top: 50px;
  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
  animation: ${animationStyle.slideUp} 0.2s ease-in-out;
`;

const SettingPopupContentWrap = styled.div`
  padding-left: 20px;
  display: flex;
  gap: 34px;
  flex-flow: column;
  width: 100%;
`;
const SettingPopupContent = styled.div`
  font: ${({ theme }) => theme.fontSizes.Body4};
  cursor: pointer;
`;

export default ProfilePage;
