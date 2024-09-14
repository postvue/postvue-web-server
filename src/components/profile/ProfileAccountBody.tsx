import LongPressToResizeButton from 'components/common/buttton/LongPressToResizeButton';
import ScrapViewPopup from 'components/popups/ScrapViewPopup';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { POST_TEXTFIELD_TYPE } from '../../const/PostContentTypeConst';
import ProfilePostListInfiniteScroll from '../../hook/ProfilePostListInfiniteScrollBeta';
import {
  isPostReactionAtom,
  reactionPostIdAtom,
} from '../../states/PostReactionAtom';
import {
  isActiveScrapViewPopupAtom,
  profilePostHashMapAtom,
} from '../../states/ProfileAtom';
import theme from '../../styles/theme';
import PostReactionListElement from '../common/posts/body/PostReactionListElement';
import PostTextContent from '../common/posts/body/PostTextContent';
import PostReactionPopup from '../popups/PostReactionPopup';
import ProfileAccountInfo from './profileaccountbody/ProfileAccountInfo';

const ProfileAccountBody: React.FC = () => {
  const snsPostHashMap = useRecoilValue(profilePostHashMapAtom);
  const navigate = useNavigate();
  const reactionPostId = useRecoilValue(reactionPostIdAtom);
  const [isPopupActive, setIsPopupActive] = useRecoilState(isPostReactionAtom);

  const param = useParams();
  const username = param.username || '';

  const [isActiveScrapViewPopup, setIsActiveScrapViewPopup] = useRecoilState(
    isActiveScrapViewPopupAtom,
  );

  useEffect(() => {
    return () => {
      // resetIsPostReactionPopup();
      setIsPopupActive(false);
      setIsActiveScrapViewPopup(false);
    };
  }, []);

  return (
    <ProfileAccountBodyContainer>
      <ProfileAccountInfo />
      <ProfilePostListContainer>
        {Array.from(snsPostHashMap.entries()).map(([k, v]) => {
          //@REFER: 나중에 수정해야 될 부분
          const imageContentList = v.postContents.filter(
            (postContent) =>
              postContent.postContentType !== POST_TEXTFIELD_TYPE,
          );

          return (
            <ProfilePostContainer
              key={k}
              onClick={() => navigate(`/${v.username}/p/${v.postId}`)}
            >
              <ProfilePostImgListWrap>
                {imageContentList.map((value, i) => {
                  return (
                    <LongPressToResizeButton key={i}>
                      <ProfilePostImgWrap>
                        <ProfilePostImg src={value.content} />
                      </ProfilePostImgWrap>
                    </LongPressToResizeButton>
                  );
                })}
              </ProfilePostImgListWrap>
              <PostReactionListElement
                postId={v.postId}
                postListRspAtom={profilePostHashMapAtom}
              />
              <PostTextContent
                postContents={v.postContents}
                postedAt={v.postedAt}
                tags={v.tags}
              />
            </ProfilePostContainer>
          );
        })}
        {username && <ProfilePostListInfiniteScroll username={username} />}
      </ProfilePostListContainer>
      {isPopupActive && <PostReactionPopup postId={reactionPostId} />}
      {isActiveScrapViewPopup &&
        reactionPostId &&
        snsPostHashMap.get(reactionPostId)?.postContents !== undefined && (
          <ScrapViewPopup
            postId={reactionPostId}
            postContentUrl={
              snsPostHashMap.get(reactionPostId)?.postContents[0].content || ''
            }
            postContentType={
              snsPostHashMap.get(reactionPostId)?.postContents[0]
                .postContentType || ''
            }
          />
        )}
    </ProfileAccountBodyContainer>
  );
};

const ProfileAccountBodyContainer = styled.div`
  margin-top: ${theme.systemSize.header.height};
`;

const ProfilePostListContainer = styled.div`
  padding-top: 26px;
  margin: 0 20px;
  display: flex;
  flex-flow: column;
  gap: 13px;
`;

const ProfilePostContainer = styled.div`
  cursor: pointer;
`;

const ProfilePostImgListWrap = styled.div``;

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

export default ProfileAccountBody;
