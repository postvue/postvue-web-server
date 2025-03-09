import MessageInboxBody from 'components/messageinbox/body/MessageInboxBody';
import MessageInboxHeader from 'components/messageinbox/header/MessageInboxHeader';
import SnsAnotherSharePoupElement from 'components/popups/snsshare/SnsAnotherSharePoupElement';
import { HOME_PATH } from 'const/PathConst';
import { MEDIA_MOBILE_MAX_WIDTH_NUM } from 'const/SystemAttrConst';
import { useGoBackOrNavigate } from 'global/util/HistoryStateUtil';
import useWindowSize from 'hook/customhook/useWindowSize';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import AppBaseTemplate from '../components/layouts/AppBaseTemplate';

const MessageInboxConversationPage: React.FC = () => {
  const goBackOrNavigate = useGoBackOrNavigate(HOME_PATH);

  const { windowWidth } = useWindowSize();

  const bodyOverscrollBehavior = useRef<string>('');
  useEffect(() => {
    if (windowWidth < MEDIA_MOBILE_MAX_WIDTH_NUM) {
      goBackOrNavigate();
    }

    bodyOverscrollBehavior.current = document.body.style.overscrollBehavior;

    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overscrollBehavior = bodyOverscrollBehavior.current;
    };
  }, []);

  return (
    <AppBaseTemplate
      hasSearchBodyModule={false}
      hasSearchInputModule={false}
      isAppContainerTopMargin={false}
      isScrollByAppContainer={false}
      slideBarNode={
        <>
          <MessageInboxHeader />
          <MessageInboxBody />
        </>
      }
    >
      <MsgInboxConversationWrap
        style={{
          height: `calc(100dvh - ${marginGap * 2}px)`,
          marginTop: `${marginGap}px`,
          marginBottom: `${marginGap}px`,
          borderRadius: `${borderRaidus}px`,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 20px 0px',
        }}
      >
        <MsgInboxConversationSubWrap>
          <MsgInboxConversationTitle>
            친구들과 대화해보세요~
          </MsgInboxConversationTitle>
          <SnsAnotherSharePoupElement />
        </MsgInboxConversationSubWrap>
      </MsgInboxConversationWrap>
    </AppBaseTemplate>
  );
};

const marginGap = 10;
const borderRaidus = 20;

const MsgInboxConversationWrap = styled.div`
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

const MsgInboxConversationSubWrap = styled.div`
  display: flex;
  flex-flow: column;
  display: flex;
  margin: auto;
`;

const MsgInboxConversationTitle = styled.div`
  font: ${({ theme }) => theme.fontSizes.Subhead3};
  padding: 20px;
  text-align: center;
`;

export default MessageInboxConversationPage;
