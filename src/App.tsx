import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import './App.css';
import AppRouter from './AppRouter';
import AppConfig from './config/AppConfig';
import theme from './styles/theme';

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

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Reset />
        <AppRouter />
        <AppConfig />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
