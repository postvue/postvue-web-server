/* eslint-disable no-undef */
module.exports = {
  babel: {
    plugins: [
      process.env.NODE_ENV === 'production' && [
        'transform-remove-console',
        {
          exclude: ['error', 'warn', 'info'], // 특정 콘솔 유지
        },
      ],
    ].filter(Boolean), // undefined 플러그인 필터링
  },
};
