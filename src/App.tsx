import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QUERY_CACHE_TIME, QUERY_STALE_TIME } from 'const/QueryClientConst';
import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import './App.css';
import AppRouter from './AppRouter';
import AppConfig from './config/AppConfig';
import theme from './styles/theme';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      gcTime: QUERY_CACHE_TIME,
    },
  },
});

const App: React.FC = () => {
  const handleResize = () => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = `${window.innerHeight}px`;
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const banner = `
  // ______           _
  // |  ___|         | |
  // | |_  ___   ___ | |  ___    __ _
  // |  _|/ _ \\ / _ \\| | / _ \\  / _\` |
  // | | |  __/|  __/| || (_) || (_| |
  // \\_|  \\___| \\___||_| \\___/  \\__, |
  //                             __/ |
  //                            |___/
  //     `;

  // console.log(`${banner}\n안녕하세요, 개발자 여러분! Feelog에 오신 걸 환영해요! 🦄 \n저희 팀과 함께할 개발자를 찾고 있어요. 관심 있으시면 언제든지 연락주세요! \nhttps://www.feelog.com
  //       `);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <Reset />
          <AppRouter />
          <AppConfig />
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;
