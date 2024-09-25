import ScrapViewPopup from 'components/popups/ScrapViewPopup';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { POST_TEXTFIELD_TYPE } from '../../const/PostContentTypeConst';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../../states/PostReactionAtom';
import {
  isActiveProfileAccountPopupAtom,
  isActiveProfileBlockPopupAtom,
  isActiveScrapViewPopupAtom,
  profilePostHashMapAtom,
} from '../../states/ProfileAtom';
import theme from '../../styles/theme';
import PostReactionListElement from '../common/posts/body/PostReactionListElement';
import PostTextContent from '../common/posts/body/PostTextContent';
import PostReactionPopup from '../popups/PostReactionPopup';
import ProfileAccountInfo from './profileaccountbody/ProfileAccountInfo';

import BlockUserPopup from 'components/popups/BlockUserPopup';
import ProfileOtherAccountPopup from 'components/popups/profileaccount/ProfileOtherAccountPopup';
import SnsSharePopup from 'components/popups/SnsSharePopup';
import ToastPopup from 'components/popups/ToastMsgPopup';
import ProfilePostListInfiniteScrollBeta from 'hook/ProfilePostListInfiniteScrollBeta';
import { QueryStateProfileInfo } from 'hook/queryhook/QueryStateProfileInfo';
import { isSharePopupAtom } from 'states/ShareAtom';
import 'swiper/css/pagination';

const ProfileAccountBody: React.FC = () => {
  const snsPostHashMap = useRecoilValue(profilePostHashMapAtom);
  const navigate = useNavigate();
  const reactionPostId = useRecoilValue(reactionPostIdAtom);
  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);
  const isSharePopup = useRecoilValue(isSharePopupAtom);

  const param = useParams();
  const username = param.username || '';

  const [isActiveScrapViewPopup, setIsActiveScrapViewPopup] = useRecoilState(
    isActiveScrapViewPopupAtom,
  );

  const isActiveProfileBlockPopup = useRecoilValue(
    isActiveProfileBlockPopupAtom,
  );

  const isActiveProfileAccountPopup = useRecoilValue(
    isActiveProfileAccountPopupAtom,
  );

  const { data } = QueryStateProfileInfo(username);

  useEffect(() => {
    return () => {
      // resetIsPostReactionPopup();
      setIsPopupActive(false);
      setIsActiveScrapViewPopup(false);
    };
  }, []);

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
            {Array.from(snsPostHashMap.entries()).map(([k, v]) => {
              //@REFER: 나중에 수정해야 될 부분
              const imageContentList = v.postContents.filter(
                (postContent) =>
                  postContent.postContentType !== POST_TEXTFIELD_TYPE,
              );

              return (
                <ProfilePostContent key={k}>
                  <ProfilePostContainer
                    onClick={() => navigate(`/${v.username}/p/${v.postId}`)}
                  >
                    <StyledSwiper
                      spaceBetween={0}
                      slidesPerView={1}
                      pagination={true}
                      loop={true}
                      modules={[
                        Pagination,
                        Navigation,
                        FreeMode,
                        Navigation,
                        Thumbs,
                      ]}
                    >
                      {imageContentList.map((value, i) => {
                        return (
                          <SwiperSlide key={i}>
                            <ProfilePostImgWrap>
                              <ProfilePostImg src={value.content} />
                            </ProfilePostImgWrap>
                          </SwiperSlide>
                        );
                      })}
                    </StyledSwiper>

                    <PostReactionListElement
                      postId={v.postId}
                      postListRspAtom={profilePostHashMapAtom}
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
              <ProfilePostListInfiniteScrollBeta username={username} />
            )}
          </ProfilePostListContainer>
        )}
        {isPopupActive && <PostReactionPopup postId={reactionPostId} />}
        {isActiveScrapViewPopup &&
          reactionPostId &&
          snsPostHashMap.get(reactionPostId)?.postContents !== undefined && (
            <ScrapViewPopup
              postId={reactionPostId}
              postContentUrl={
                snsPostHashMap.get(reactionPostId)?.postContents[0].content ||
                ''
              }
              postContentType={
                snsPostHashMap.get(reactionPostId)?.postContents[0]
                  .postContentType || ''
              }
            />
          )}
      </ProfileAccountBodyContainer>

      {isSharePopup && <SnsSharePopup />}
      {isActiveProfileAccountPopup && <ProfileOtherAccountPopup />}
      {isActiveProfileBlockPopup && data && (
        <BlockUserPopup
          isBlocked={data.isBlocked}
          userInfo={{ username: data.username, userId: data.userId }}
        />
      )}
      <ToastPopup />
    </>
  );
};

const ProfileAccountBodyContainer = styled.div`
  margin-top: ${theme.systemSize.header.height};
`;

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
`;

const ProfilePostContent = styled.div``;

const ProfilePostContainer = styled.div`
  cursor: pointer;
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding}
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
  border-radius: 8px;
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
`;

export default ProfileAccountBody;
