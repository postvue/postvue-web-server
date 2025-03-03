import MsgBlockHiddenManagePopup from 'components/messageinbox/popup/MsgBlockHiddenManagePopup';
import { APP_CONTACT_EMAIL } from 'const/AppInfoConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import useWindowSize from 'hook/customhook/useWindowSize';
import { QueryStateMsgInboxListInfinite } from 'hook/queryhook/QueryStateMsgInboxListInfinite';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import BottomNavBar from '../components/BottomNavBar';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';
import MessageInboxBody from '../components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from '../components/messageinbox/header/MessageInboxHeader';
import { isActiveMsgBlockHiddenManagePopupAtom } from '../states/MsgInboxAtom';

const MessageInboxPage: React.FC = () => {
  const [
    isActiveMsgBlockHiddenManagePopup,
    setIsActiveMsgBlockHiddenManagePopup,
  ] = useRecoilState(isActiveMsgBlockHiddenManagePopupAtom);

  const { isFetched: isFetchedByMsgInbox } = QueryStateMsgInboxListInfinite();

  const { windowWidth } = useWindowSize();

  useEffect(() => {
    return () => {
      setIsActiveMsgBlockHiddenManagePopup(false);
    };
  }, []);

  const handleShare = () => {
    const email = APP_CONTACT_EMAIL; // 수신자 이메일
    const subject = 'Check this out!'; // 제목
    const body = 'I thought this might interest you.'; // 본문

    // Mailto 링크 생성
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    // 링크 실행
    window.location.href = mailtoLink;
  };

  return (
    <>
      <AppBaseTemplate isScrollByAppContainer={false}>
        <MessageInboxHeader />
        {isFetchedByMsgInbox && (
          <>
            <MessageInboxBody />
          </>
        )}
        <BottomNavBar />
        {windowWidth <= MEDIA_MOBILE_MAX_WIDTH_NUM &&
          isActiveMsgBlockHiddenManagePopup && <MsgBlockHiddenManagePopup />}
      </AppBaseTemplate>
    </>
  );
};

export default MessageInboxPage;
