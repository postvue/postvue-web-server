import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapkitProvider } from 'components/lib/mapkitjs/MapkitProvider';
import { APP_SERVICE_HIDDEN_CONSOLE_LOG } from 'const/AppInfoConst';
import { GOOGLE_OAUTH_CLIENT_ID } from 'const/login/GoogleConst';
import { APPLE_MAP_ACCESS_TOKEN } from 'const/MapExploreConst';
import { QUERY_CACHE_TIME, QUERY_STALE_TIME } from 'const/QueryClientConst';
import { WindowSizeListener } from 'hook/customhook/useWindowSize';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import './App.css';
import AppRouter from './AppRouter';
import AppConfig from './config/AppConfig';
import './styles/keyframes.css';
import theme from './styles/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      gcTime: QUERY_CACHE_TIME,
    },
  },
});

const App: React.FC = () => {
  console.info(APP_SERVICE_HIDDEN_CONSOLE_LOG);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <MapkitProvider tokenOrCallback={APPLE_MAP_ACCESS_TOKEN || ''}>
          <RecoilRoot>
            <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
              <ThemeProvider theme={theme}>
                <Reset />
                <WindowSizeListener />
                <AppRouter />
                <AppConfig />
              </ThemeProvider>
            </GoogleOAuthProvider>
          </RecoilRoot>
        </MapkitProvider>
      </HelmetProvider>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
};

export default App;
export { queryClient };
