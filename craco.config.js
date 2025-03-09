/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { GenerateSW } = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  babel: {
    plugins: isProduction
      ? [
          // production 모드일 때만 console.log 제거 (console.error, console.warn은 유지)
          ['transform-remove-console', { exclude: ['error', 'warn'] }],
        ]
      : [],
  },
  webpack: {
    plugins: [
      new GenerateSW({
        clientsClaim: true, // 활성화된 클라이언트를 즉시 제어
        skipWaiting: true, // 대기 중인 Service Worker를 즉시 활성화
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      }),
    ],
    configure: (webpackConfig) => {
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.oneOf) {
          rule.oneOf.forEach((oneOfRule) => {
            if (
              oneOfRule.use &&
              oneOfRule.use.some(
                (use) =>
                  typeof use === 'object' &&
                  use.loader &&
                  use.loader.includes('sass-loader'),
              )
            ) {
              oneOfRule.use.forEach((use) => {
                if (
                  typeof use === 'object' &&
                  use.loader &&
                  use.loader.includes('sass-loader')
                ) {
                  use.options = {
                    implementation: require('sass'), // Dart Sass 적용
                    sassOptions: {
                      outputStyle: 'compressed', // CSS 압축 적용
                    },
                  };
                }
              });
            }
          });
        }
      });

      return webpackConfig;
    },
  },
};
