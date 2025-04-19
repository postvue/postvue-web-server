import {
  EVENT_DATA_ROUTE_BACK_TYPE,
  EVENT_DATA_ROUTE_NAVIGATE_TYPE,
  EVENT_DATA_ROUTE_POP_TO_TOP_TYPE,
  EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE,
  EVENT_DATA_ROUTE_PUSH_TYPE,
  EVENT_DATA_ROUTE_REPLACE_TYPE,
  EVENT_DATA_ROUTE_RESET_TYPE,
} from 'const/ReactNativeConst';
import {
  navigateToMainTab,
  stackRouterBack,
  stackRouterNavigation,
  stackRouterPush,
  stackRouterReplace,
  stackRouterResetAndPush,
  tabBackNavigation,
} from 'global/util/reactnative/nativeRouter';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
  }
}

interface AppLinkProps {
  type: string;
  children: ReactNode;
  screenName?: string;
  to?: string;
  style?: React.CSSProperties;
}

const AppLink: React.FC<
  AppLinkProps & React.RefAttributes<HTMLAnchorElement>
> = ({ screenName, to, children, type, style }) => {
  const navigate = useNavigate();
  return (
    <AppContainer
      style={style}
      className="app-link"
      onClick={() => {
        if (type === EVENT_DATA_ROUTE_BACK_TYPE) {
          stackRouterBack(navigate);
        } else if (type === EVENT_DATA_ROUTE_PUSH_TYPE) {
          if (!to) return;
          stackRouterPush(navigate, to);
        } else if (type === EVENT_DATA_ROUTE_NAVIGATE_TYPE) {
          if (!to) return;
          stackRouterNavigation(to);
        } else if (type === EVENT_DATA_ROUTE_REPLACE_TYPE) {
          if (!to) return;
          stackRouterReplace(to);
        } else if (type === EVENT_DATA_ROUTE_RESET_TYPE) {
          if (!to) return;
          stackRouterResetAndPush(navigate, to);
        } else if (type === EVENT_DATA_ROUTE_POP_TO_TOP_TYPE) {
          if (!(screenName && to)) return;
          navigateToMainTab(navigate, screenName, to);
        } else if (type === EVENT_DATA_ROUTE_PREVIOUS_TAB_TYPE) {
          tabBackNavigation(navigate);
        }
      }}
    >
      {children}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

export default AppLink;
