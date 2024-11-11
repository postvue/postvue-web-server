import { ReactComponent as FacebookShareButtonIcon } from 'assets/images/icon/svg/share/FacebookShareButtonIcon.svg';
import { ReactComponent as KakaoShareButtonIcon } from 'assets/images/icon/svg/share/KakaoShareButtonIcon.svg';
import { ReactComponent as MessageShareButtonIcon } from 'assets/images/icon/svg/share/MessageShareButtonIcon.svg';
import { ReactComponent as PinterestShareButtonIcon } from 'assets/images/icon/svg/share/PinterestShareButtonIcon.svg';
import { ReactComponent as ShareMoreButtonIcon } from 'assets/images/icon/svg/share/ShareMoreButtonIcon.svg';
import { ReactComponent as XShareButtonIcon } from 'assets/images/icon/svg/share/XShareButtonIcon.svg';
import BorderCircleButton from 'components/common/buttton/BorderCircleButton';
import LoadingComponent from 'components/common/container/LoadingComponent';
import HeaderLayout from 'components/layouts/HeaderLayout';
import SearchInputTemplate from 'components/posecompose/PostComposeLocation/SearchInputTemplate';
import { ACTIVE_CLASS_NAME } from 'const/ClassNameConst';
import { MSG_CONTENT_TEXT_TYPE } from 'const/MsgContentTypeConst';
import { SNS_SHARE_USER_SEARCH_PHASE_TEXT } from 'const/SystemPhraseConst';
import { getSearchQueryByDebounce } from 'global/util/SearchUtil';
import { handleShareUtil } from 'global/util/ShareUtil';
import { isValidString } from 'global/util/ValidUtil';
import ProfileMyFollowingListInfiniteScroll from 'hook/ProfileMyFollowingListInfiniteScroll';
import ProfileSearchUserListInfiniteScroll from 'hook/ProfileSearchUserListInfiniteScroll';
import { QueryStateMyProfileFollowingList } from 'hook/queryhook/QueryStateMyProfileFollowingListInfinite';
import { QueryStateSearchProfileUserListInfinite } from 'hook/queryhook/QueryStateSearchProfileUserListInfinite';
import React, { useEffect, useRef, useState } from 'react';
import {
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from 'react-share';
import { useRecoilState } from 'recoil';
import msgConversationWsService from 'services/message/MsgConversationWsService';
import {
  isShareUserSearchInputActiveAtom,
  shareUserSearchTempWordAtom,
} from 'states/ShareAtom';
import styled from 'styled-components';
import theme from 'styles/theme';

interface SnsShareBodyProps {
  shareLink: string;
}

const SnsShareBody: React.FC<SnsShareBodyProps> = ({ shareLink }) => {
  const shareSearchInputRef: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [shareUserSearchWord, setShareUserSearchWord] = useState<string>('');

  const [shareUserSearchTempWord, setShareUserSearchTempWord] = useRecoilState(
    shareUserSearchTempWordAtom,
  );

  const [isShareUserSearchInputActive, setIsShareUserSearchInputActive] =
    useRecoilState(isShareUserSearchInputActiveAtom);

  const SMSShareButtonHref = (url: string, body: string) => {
    const smsHref = `sms:&body=${encodeURIComponent(body)}%20${encodeURIComponent(url)}`;

    return smsHref;
  };

  const debouncedGetSearchQuery = getSearchQueryByDebounce(
    (word: string) => {
      if (!isValidString(word)) return;
      setLoading(true);
      setShareUserSearchWord(word);
      setLoading(false);
    },
    [],
    1000,
  );

  const { data: ProfileFollowData } = QueryStateMyProfileFollowingList(
    shareUserSearchWord !== '',
  );

  const { data: ProfileSearchUserList } =
    QueryStateSearchProfileUserListInfinite(shareUserSearchWord);

  const onClickShareButton = (targetUserId: string, shareLink: string) => {
    msgConversationWsService.sendMessage(targetUserId, {
      msgType: MSG_CONTENT_TEXT_TYPE,
      msgContent: shareLink,
    });

    setSenededSharedList(new Map(sendedSharedList).set(targetUserId, true));
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
        BorderCircleButtonStyle={{ cursor: 'default' }}
      />
    );
  };

  useEffect(() => {
    return () => {
      setShareUserSearchWord('');
      setShareUserSearchTempWord('');
    };
  }, []);
  return (
    <>
      <SearchButtonInputHeaderContainer>
        <HeaderLayout>
          <SnsShareSearchInputWrap>
            <SearchButtonInputWrap>
              <SearchInputTemplate
                searchInputRef={shareSearchInputRef}
                placeholder={SNS_SHARE_USER_SEARCH_PHASE_TEXT}
                debouncedGetSearchQuery={debouncedGetSearchQuery}
                setLoading={setLoading}
                searchTempWord={shareUserSearchTempWord}
                setSearchTempWord={setShareUserSearchTempWord}
                isSearchInputActive={isShareUserSearchInputActive}
                setIsSearchInputActive={setIsShareUserSearchInputActive}
              />
            </SearchButtonInputWrap>
          </SnsShareSearchInputWrap>
        </HeaderLayout>
        <SnsUserShareContainer>
          {shareUserSearchTempWord === '' && (
            <>
              {ProfileFollowData && (
                <>
                  {ProfileFollowData.pages.flatMap((page) =>
                    page
                      .filter((value) => value.isFollowed && !value.isBlocked)
                      .map((v, i) => (
                        <React.Fragment key={i}>
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
                        </React.Fragment>
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
                {ProfileSearchUserList.pages.flatMap((page) =>
                  page.getProfileUserByUsernameList.map((v, i) => (
                    <React.Fragment key={i}>
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
                    </React.Fragment>
                  )),
                )}
                <ProfileSearchUserListInfiniteScroll
                  username={shareUserSearchWord}
                />
              </>
            )}
        </SnsUserShareContainer>
      </SearchButtonInputHeaderContainer>

      <AnotherSnsShareContainer>
        <AnotherSnsShareWrap>
          <a href={SMSShareButtonHref(window.location.href, '테스트')}>
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <MessageShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>메시지</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </a>
          <AnotherSnsShareItem>
            <AnotherSnsShareIconWrap>
              <KakaoShareButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>Kakao</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
          <PinterestShareButton
            url={window.location.href}
            media={window.location.href}
          >
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <PinterestShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>Pinterest</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </PinterestShareButton>
          <FacebookShareButton url={window.location.href}>
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <FacebookShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>Facebook</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </FacebookShareButton>
          <TwitterShareButton url={window.location.href}>
            <AnotherSnsShareItem>
              <AnotherSnsShareIconWrap>
                <XShareButtonIcon />
              </AnotherSnsShareIconWrap>
              <AnotherSnsShareTitle>X</AnotherSnsShareTitle>
            </AnotherSnsShareItem>
          </TwitterShareButton>
          <AnotherSnsShareItem
            onClick={() => {
              handleShareUtil({
                url: window.location.href,
                text: '이것 좀 보세요! 👀',
              });
            }}
          >
            <AnotherSnsShareIconWrap>
              <ShareMoreButtonIcon />
            </AnotherSnsShareIconWrap>
            <AnotherSnsShareTitle>더 보기</AnotherSnsShareTitle>
          </AnotherSnsShareItem>
        </AnotherSnsShareWrap>
      </AnotherSnsShareContainer>
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

const SearchButtonInputHeaderContainer = styled.div`
  margin-top: 30px;
  flex: 1;
`;

const SnsShareSearchInputWrap = styled.div`
  width: 100%;
  display: flex;
  margin: auto 0;
`;

const SearchButtonInputWrap = styled.div`
  padding: 0 ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  width: 100%;
`;

const AnotherSnsShareContainer = styled.div`
  display: flex;

  width: 100%;
  height: 100px;
  overflow-x: scroll;
`;

const AnotherSnsShareWrap = styled.div`
  padding: 10px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding} 40px
    ${({ theme }) => theme.systemSize.appDisplaySize.bothSidePadding};
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
`;

const AnotherSnsShareItem = styled.div`
  display: flex;
  flex-flow: column;
`;

const AnotherSnsShareIconWrap = styled.div`
  margin: 0 auto;
`;

const AnotherSnsShareTitle = styled.div`
  text-align: center;
  font: ${({ theme }) => theme.fontSizes.Location2};
  color: ${({ theme }) => theme.grey.Grey8};
`;

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
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 30px;
`;
const ShareUserWrap = styled.div``;
const ShareUserNickname = styled.div`
  margin: auto 0;
  padding-left: 12px;
  font: ${({ theme }) => theme.fontSizes.Subhead2};
`;
const ShareUserUsername = styled(ShareUserNickname)`
  font: ${({ theme }) => theme.fontSizes.Subhead1};
  color: ${({ theme }) => theme.grey.Grey7};
`;

const SnsUserShareContainer = styled.div`
  height: 300px;
  overflow-y: scroll;
`;

export default SnsShareBody;
