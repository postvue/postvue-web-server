import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { POST_TEXTFIELD_TYPE } from '../../const/PostContentTypeConst';
import ProfilePostListInfiniteScroll from '../../hook/ProfilePostListInfiniteScroll';
import { isPostReactionPopupAtom } from '../../states/PostReactionAtom';
import { profilePostHashMapAtom } from '../../states/ProfileAtom';
import theme from '../../styles/theme';
import PostReactionListElement from '../common/posts/body/PostReactionListElement';
import PostTextContent from '../common/posts/body/PostTextContent';
import PostReactionPopup from '../popups/PostReactionPopup';
import ProfileAccountInfo from './profileaccountbody/ProfileAccountInfo';

const ProfileAccountBody: React.FC = () => {
  const snsPostHashMap = useRecoilValue(profilePostHashMapAtom);
  const navigate = useNavigate();
  const isPostReactionPopup = useRecoilValue(isPostReactionPopupAtom);

  return (
    <ProfileAccountBodyContainer>
      <ProfileAccountInfo />
      <ProfilePostListContainer>
        {Array.from(snsPostHashMap.entries()).map(([k, v]) => {
          const imageContentList = v.postContents.filter(
            (postContent) =>
              postContent.postContentType !== POST_TEXTFIELD_TYPE,
          );

          imageContentList;

          return (
            <ProfilePostContainer
              key={k}
              onClick={() => navigate(`/${v.username}/p/${v.postId}`)}
            >
              <ProfilePostImgListWrap>
                {imageContentList.map((v, i) => {
                  return (
                    <ProfilePostImgWrap key={i}>
                      <ProfilePostImg src={v.content} />
                    </ProfilePostImgWrap>
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
        <ProfilePostListInfiniteScroll />
      </ProfilePostListContainer>
      {isPostReactionPopup && (
        <PostReactionPopup postId={isPostReactionPopup} />
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
  aspect-ratio: 3/3;
  background: url(${(props) => props.src}) center center / cover;
  border-radius: 8px;
`;

export default ProfileAccountBody;
