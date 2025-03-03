import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import LoadingComponent from 'components/common/container/LoadingComponent';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { DirectMsgReq } from 'global/interface/message';
import { isValidString } from 'global/util/ValidUtil';
import ProfileMyFollowingListInfiniteScroll from 'hook/ProfileMyFollowingListInfiniteScroll';
import ProfileSearchUserListInfiniteScroll from 'hook/ProfileSearchUserListInfiniteScroll';
import { QueryStateMyProfileFollowingList } from 'hook/queryhook/QueryStateMyProfileFollowingListInfinite';
import { QueryStateSearchProfileUserListInfinite } from 'hook/queryhook/QueryStateSearchProfileUserListInfinite';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { createDirectMsgConversation } from 'services/message/createDirectMsgConversation';

import {
  isLoadingSearchSharePoupupAtom,
  isShareUserSearchInputActiveAtom,
  shareUserSearchTempWordAtom,
  shareUserSearchWordAtom,
} from 'states/ShareAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface SnsShareBodyProps {
  shareLink: string;
  SnsSharePopupBodyContainerStyle?: React.CSSProperties;
}

const SnsSharePopupBody: React.FC<SnsShareBodyProps> = ({
  shareLink,
  SnsSharePopupBodyContainerStyle,
}) => {
  const loading = useRecoilValue(isLoadingSearchSharePoupupAtom);

  const [shareUserSearchWord, setShareUserSearchWord] = useRecoilState(
    shareUserSearchWordAtom,
  );

  const [shareUserSearchTempWord, setShareUserSearchTempWord] = useRecoilState(
    shareUserSearchTempWordAtom,
  );

  const isShareUserSearchInputActive = useRecoilValue(
    isShareUserSearchInputActiveAtom,
  );

  // @REFER 기능 주석
  // const SMSShareButtonHref = (url: string, body: string) => {
  //   const smsHref = `sms:&body=${encodeURIComponent(body)}%20${encodeURIComponent(url)}`;

  //   return smsHref;
  // };

  const { data: ProfileFollowData } = QueryStateMyProfileFollowingList(
    shareUserSearchWord !== '',
  );

  const { data: ProfileSearchUserList } =
    QueryStateSearchProfileUserListInfinite(shareUserSearchWord);

  const onClickShareButton = (targetUserId: string, shareLink: string) => {
    // msgConversationWsService.sendMessage(targetUserId, {
    //   msgType: MSG_CONTENT_TEXT_TYPE,
    //   msgContent: shareLink,
    // });
    const formData = new FormData();

    const directMsgReq: DirectMsgReq = {
      msgTextContent: shareLink,
    };

    const directMsgReqBlob = new Blob([JSON.stringify(directMsgReq)], {
      type: 'application/json',
    });

    formData.append('directMsgReq', directMsgReqBlob);
    createDirectMsgConversation(targetUserId, formData)
      .then(() => {
        setSenededSharedList(new Map(sendedSharedList).set(targetUserId, true));
      })
      .catch((error: any) => {
        const data: any = error.response.data.message;
        alert(data);
      });
  };

  const [sendedSharedList, setSenededSharedList] = useState<
    Map<string, boolean>
  >(new Map());

  const ShareButton = (targetUserId: string) => {
    return (
      <BorderCircleButton
        className={ACTIVE_CLASS_NAME}
        contentText="공유"
        activeBackgroundColor={theme.mainColor.Blue}
        activeBorderColor={theme.mainColor.Blue}
        activeFontColor={theme.mainColor.White}
        fontSize={theme.fontSizes.Body3}
        onClickFunc={() => onClickShareButton(targetUserId, shareLink)}
        BorderCircleButtonStyle={{ height: '25px', margin: 'auto 0' }}
      />
    );
  };

  const SenedShareButton = () => {
    return (
      <BorderCircleButton
        className={ACTIVE_CLASS_NAME}
        contentText="보냄"
        activeBackgroundColor={theme.mainColor.Black}
        activeBorderColor={theme.mainColor.Black}
        activeFontColor={theme.mainColor.White}
        fontSize={theme.fontSizes.Body3}
        BorderCircleButtonStyle={{
          height: '25px',
          margin: 'auto 0',
          cursor: 'default',
        }}
      />
    );
  };

  const duration = 500;
  const [init, setInit] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, duration);
    return () => {
      setShareUserSearchWord('');
      setShareUserSearchTempWord('');
    };
  }, []);
  return (
    <>
      <SnsSharePopupBodyContainer style={SnsSharePopupBodyContainerStyle}>
        <SnsUserShareContainer>
          {shareUserSearchTempWord === '' && (
            <>
              {ProfileFollowData && init && (
                <>
                  {ProfileFollowData.pages.flatMap((page) =>
                    page
                      .filter((value) => value.isFollowed)
                      .map((v, i) => (
                        <PostProfileMyFollowContainer key={i}>
                          <PostProfileMyFollowWrap>
                            <ProfileImgUsernameWrap>
                              <PostProfileMyFollowImg src={v.profilePath} />
                              <ShareUserWrap>
                                <ShareUserNickname>
                                  {v.nickname}
                                </ShareUserNickname>
                                <ShareUserUsername>
                                  @{v.username}
                                </ShareUserUsername>
                              </ShareUserWrap>
                            </ProfileImgUsernameWrap>
                            {sendedSharedList.get(v.userId)
                              ? SenedShareButton()
                              : ShareButton(v.userId)}
                          </PostProfileMyFollowWrap>
                        </PostProfileMyFollowContainer>
                      )),
                  )}
                </>
              )}
              <ProfileMyFollowingListInfiniteScroll />
            </>
          )}
          {shareUserSearchTempWord !== '' &&
            !loading &&
            isValidString(shareUserSearchWord) &&
            ProfileSearchUserList && (
              <>
                {init &&
                  ProfileSearchUserList.pages.flatMap((page) =>
                    page.getProfileUserByUsernameList.map((v, i) => (
                      <PostProfileMyFollowContainer key={i}>
                        <PostProfileMyFollowWrap>
                          <ProfileImgUsernameWrap>
                            <PostProfileMyFollowImg src={v.profilePath} />
                            <ShareUserWrap>
                              <ShareUserNickname>
                                {v.nickname}
                              </ShareUserNickname>
                              <ShareUserUsername>
                                @{v.username}
                              </ShareUserUsername>
                            </ShareUserWrap>
                          </ProfileImgUsernameWrap>
                          {sendedSharedList.get(v.userId)
                            ? SenedShareButton()
                            : ShareButton(v.userId)}
                        </PostProfileMyFollowWrap>
                      </PostProfileMyFollowContainer>
                    )),
                  )}
                <ProfileSearchUserListInfiniteScroll
                  username={shareUserSearchWord}
                />
              </>
            )}
        </SnsUserShareContainer>
      </SnsSharePopupBodyContainer>

      {/* sns other 컴포넌트 영역 */}
      {loading && isShareUserSearchInputActive && (
        <LoadingComponent
          LoadingComponentStyle={{
            position: 'absolute',
            top: '25%',
            transform: 'translate(-50%, 0)',
          }}
        />
      )}
    </>
  );
};

const SnsSharePopupBodyContainer = styled.div``;

const PostProfileMyFollowContainer = styled.div``;
const PostProfileMyFollowWrap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 11px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
`;
const ProfileImgUsernameWrap = styled.div`
  display: flex;
`;
const PostProfileMyFollowImg = styled.img`
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 30px;
  object-fit: cover;
`;
const ShareUserWrap = styled.div``;
const ShareUserNickname = styled.div`
  margin: auto 0;
  padding-left: 12px;
  font: ${({ theme }) => theme.fontSizes.Subhead3};
`;
const ShareUserUsername = styled(ShareUserNickname)`
  font: ${({ theme }) => theme.fontSizes.Body2};
  color: ${({ theme }) => theme.grey.Grey7};
`;

const SnsUserShareContainer = styled.div`
  // height: calc(100% - ${({ theme }) => theme.systemSize.header.height});
  // overflow-y: scroll;
  // overscroll-behavior: contain;
  // margin-top: 30px;
`;

export default SnsSharePopupBody;
