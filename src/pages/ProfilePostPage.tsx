import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';

import styled from 'styled-components';
import 'swiper/css';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import BottomNavBar from '../components/BottomNavBar';
import FollowButton from '../components/common/buttton/FollowButton';
import PostReactionSingleElement from '../components/common/posts/body/PostReactionSingleElement';
import PostTextContent from '../components/common/posts/body/PostTextContent';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import PopupLayout from '../components/layouts/PopupLayout';
import PostReactionPopup from '../components/popups/PostReactionPopup';
import ScrapViewPopup from '../components/popups/ScrapViewPopup';
import ToastMsgPopup, { notify } from '../components/popups/ToastMsgPopup';
import PrevButton from '../components/PrevButton';
import { INIT_SCROLL_POSITION } from '../const/AttributeConst';
import { POST_TEXTFIELD_TYPE } from '../const/PostContentTypeConst';
import { PROFILE_URL_CLIP_BOARD_TEXT } from '../const/SystemPhraseConst';
import { copyClipBoard } from '../global/util/CopyUtil';
import { getPost } from '../services/post/getPost';
import { postRspAtom } from '../states/PostAtom';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../states/PostReactionAtom';
import { isActiveScrapViewPopupAtom } from '../states/ProfileAtom';
import { systemPostRspHashMapAtom } from '../states/SystemConfigAtom';
import theme from '../styles/theme';

const ProfilePostPage: React.FC = () => {
  const param = useParams();
  const [snsSystemPostHashMap, setSnsSystemPostHashMap] = useRecoilState(
    systemPostRspHashMapAtom,
  );
  const postId = param.post_id;
  const [snsPost, setSnsPost] = useRecoilState(postRspAtom);
  const [isSettingActive, setIsSettingActive] = useState<boolean>(false);
  const [reactionPostId, setReactionPostId] =
    useRecoilState(reactionPostIdAtom);

  const resetIsPostReactionPopup = useResetRecoilState(reactionPostIdAtom);
  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);
  const [isActiveScrapView, setIsActiveScrapView] = useRecoilState(
    isActiveScrapViewPopupAtom,
  );

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
      setIsPopupActive(false);
      setIsActiveScrapView(false);
    };
  }, []);

  const onClickSettingButton = () => {
    setIsSettingActive(true);
  };
  const onClickPopupContainer = () => {
    setIsSettingActive(false);
  };
  async function onClickClipBoardCopyButton(copyText: string) {
    try {
      copyClipBoard(copyText);

      notify(PROFILE_URL_CLIP_BOARD_TEXT);
    } catch (e) {
      alert(e);
    }
  }

  const firstPostContent = snsPost?.postContents[0];

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
          <Link to={`/${snsPost?.username}`}>
            <ProfileLinkDiv>
              <ProfileImg src={snsPost?.profilePath} />
              <ProfileUserNameFollowWrap>
                <ProfileUserName>{snsPost?.username}</ProfileUserName>
                <ProfilePosition>{snsPost.location.address}</ProfilePosition>
                {/**@REFER: 수정 */}
              </ProfileUserNameFollowWrap>
            </ProfileLinkDiv>
          </Link>
          {snsPost?.followable ? (
            <FollowButton
              userId={snsPost.userId}
              fontSize={theme.fontSizes.Subhead1}
              style={FollowStyle}
              isFollow={snsPost.isFollowed}
            />
          ) : (
            <></>
          )}
        </ProfileWrap>

        {postId && (
          <PostReactionSingleElement
            postId={postId}
            postRspAtom={postRspAtom}
          />
        )}

        <PostTextContent
          postContents={snsPost.postContents}
          postedAt={snsPost.postedAt}
          tags={snsPost.tags}
        />

        {/* <div>{snsPost?.location.latitude}</div>
        <div>{snsPost?.location.longitude}</div> */}
      </PostContentContainer>
      <BoundaryBarStick />
      <RelatedPostContainer>
        <RelatedTitle>연관 게시글</RelatedTitle>
      </RelatedPostContainer>

      {isSettingActive && (
        <PopupLayout setIsPopup={setIsSettingActive}>
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
        </PopupLayout>
      )}
      {isPopupActive && <PostReactionPopup postId={reactionPostId} />}
      {isActiveScrapView && postId !== undefined && firstPostContent && (
        <ScrapViewPopup
          postId={postId}
          postContentUrl={firstPostContent.content}
          postContentType={firstPostContent.postContentType}
        />
      )}

      <ToastMsgPopup />
      <BottomNavBar />
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
  border-radius: 30px 30px 0px 0px;
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
  padding: 14px 0 0 22px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
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

const SettingPopupWrap = styled.div`
  bottom: 0;
  z-index: 20;
  height: 297px;

  padding-top: 50px;
  width: 100%;
  background: white;
  border-radius: 15px 15px 0 0;
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

export default ProfilePostPage;
