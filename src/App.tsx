import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MapkitProvider } from 'components/lib/mapkitjs/MapkitProvider';
import { APP_CONTACT_EMAIL, APP_SERVICE_NAME } from 'const/AppInfoConst';
import { APPLE_MAP_ACCESS_TOKEN } from 'const/MapExploreConst';
import { QUERY_CACHE_TIME, QUERY_STALE_TIME } from 'const/QueryClientConst';
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
  const banner = `
  ______           _
  |  ___|         | |
  | |_  ___   ___ | |  ___    __ _
  |  _|/ _ \\ / _ \\| | / _ \\  / _\` |
  | | |  __/|  __/| || (_) || (_| |
  \\_|  \\___| \\___||_| \\___/  \\__, |
                              __/ |
                             |___/
      `;

  console.info(`${banner}\n안녕하세요, 개발자 여러분! ${APP_SERVICE_NAME}에 오신 걸 환영해요! 🦄 \n저희 팀과 함께할 개발자를 찾고 있어요. 관심 있으시면 언제든지 연락주세요! \n${APP_CONTACT_EMAIL}
        `);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <MapkitProvider tokenOrCallback={APPLE_MAP_ACCESS_TOKEN || ''}>
          <RecoilRoot>
            <ThemeProvider theme={theme}>
              <Reset />
              <AppRouter />
              <AppConfig />
            </ThemeProvider>
          </RecoilRoot>
        </MapkitProvider>
      </HelmetProvider>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
};

export default App;
export { queryClient };
