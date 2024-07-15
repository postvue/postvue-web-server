import React, { useEffect } from 'react';
import './App.css';
import AppRouter from './AppRouter';
import { Reset } from 'styled-reset';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import AppConfig from './config/AppConfig';

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
    <ThemeProvider theme={theme}>
      <AppConfig />
      <Reset />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;
