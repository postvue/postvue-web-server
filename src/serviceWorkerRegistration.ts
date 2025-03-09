export const register = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
      })
      .then((registration) => {
        console.log('Service worker registration succeeded: ', registration);
      })
      .catch((error) => {
        console.error('Service worker registration failed: ', error);
      });
  } else {
    console.log('Service workers are not supported.');
  }
};
