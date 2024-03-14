module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['bottom-sheet'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      { additionalHooks: 'useWorkletCallback' },
    ],
    'bottom-sheet/no-reanimated-hook-deps': 'error',
  },
};
